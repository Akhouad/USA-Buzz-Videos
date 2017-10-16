import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AdMob } from '@ionic-native/admob';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ModalContentPage } from '../pages/home/home';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ModalContentPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ModalContentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AdMob,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
