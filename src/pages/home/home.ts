import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { AdMob } from '@ionic-native/admob';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  videosAPI: any;
  videos: any;

  interstitialId: any;
  bannerId: any;

  loader: any;

  from:any = 0;
  to:any = 9;

  currentPage: any = 1;

  constructor(public navCtrl: NavController, private http: Http, public modalCtrl: ModalController, public params: NavParams, private loadingCtrl: LoadingController, private admob: AdMob) {

    this.getVideos(0, 9);

    this.bannerId = atob('Y2EtYXBwLXB1Yi0yODUwOTcwMDIxOTc0NDgyLzExNzM1MDc0NTA=');
    this.interstitialId = atob('Y2EtYXBwLXB1Yi0yODUwOTcwMDIxOTc0NDgyLzM2MDgwOTkxMDA=');

    this.admob.createBanner({
      adId: this.bannerId,
      autoShow: true
    });
  }

  getVideos(from, to){
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();

    this.videosAPI = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=50&key=AIzaSyBosmeiB6Lk-3ZBhGuEHcs7MgKacLEVN_o';

    this.http
      .get(this.videosAPI)
      .map(res => res.json())
      .subscribe(
        data => {
          this.videos = data.items;
          this.loader.dismiss();
        },
        err => console.error(err)
      );

    this.from = from;
    this.to = to;
  }

  openModal(prms) {
    let modal = this.modalCtrl.create(ModalContentPage, prms);
    modal.present();
  }

  pageClicked(index){
    if(index !== this.currentPage){
      this.currentPage = index;
      let pages = [[0, 9], [10, 19], [20, 29], [30, 39], [40, 49]];
      index -= 1;
      this.getVideos(pages[index][0], pages[index][1]);
    }
  }

  setPageClass(index){
    if(index == this.currentPage){
      return "active";
    }
  }

}


@Component({
  selector: 'modal',
  template: `
    <ion-header>
      <div class="title">{{data.title}}</div>
      <div class="close" (click)="dismiss()">
        <ion-icon name="md-close"></ion-icon>
      </div>
    </ion-header>
    <ion-content padding>
      <div class="video-date">{{data.date | slice:0:10}}</div>
      <div class="video-author">{{data.author}}</div>
      <iframe width="100%" height="250" [src]="url" frameborder="0" allowfullscreen></iframe>
    </ion-content>
  `
})
export class ModalContentPage {
  data: any;
  private url:SafeResourceUrl;

  interstitialId: any;
  bannerId: any;

  loader: any;

  constructor(public navCtrl: NavController, public params: NavParams, public viewCtrl: ViewController, private sanitizer: DomSanitizer, private admob: AdMob, private loadingCtrl: LoadingController) {
    this.data = {
      id: this.params.get('id'),
      title: this.params.get('title'),
      author: this.params.get('author'),
      date: this.params.get('date')
    };

    this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.data.id);

    this.bannerId = atob('Y2EtYXBwLXB1Yi0yODUwOTcwMDIxOTc0NDgyLzExNzM1MDc0NTA=');
    this.interstitialId = atob('Y2EtYXBwLXB1Yi0yODUwOTcwMDIxOTc0NDgyLzM2MDgwOTkxMDA=');

    this.admob.createBanner({
      adId: this.bannerId,
      autoShow: true
    });

    this.intAd();
  }

  intAd(){
      this.admob.prepareInterstitial({
        adId: this.interstitialId,
        autoShow: true
      });

      this.loader = this.loadingCtrl.create({
        content: "Please wait...."
      });

      this.loader.present();

      let self = this;
      document.addEventListener('onAdLoaded', function () {
        self.loader.dismiss();
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();

    this.intAd();
  }
}
