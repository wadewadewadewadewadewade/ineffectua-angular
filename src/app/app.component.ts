import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { SplashPage } from './splash/splash.page';
//import { Animation } from '@ionic/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private modalController: ModalController,
    //private animation: Animation
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      //this.displayCustomSplash();
      this.splashScreen.hide();
    });
  }

  async displayCustomSplash() {
    await this.modalController.create({
      component: SplashPage,
      cssClass: 'custom-splash-page',
      // leaveAnimation: this.animation.beforeStyles({ 'opacity': 1 }).fromTo('opacity', 1, 0) https://www.joshmorony.com/create-a-custom-modal-page-transition-animation-in-ionic/
    }).then(res => {
      res.present().then(() => {
        this.splashScreen.hide();
        setTimeout(() => {
          res.dismiss();
        }, 2000);
      });
    });
  }
}
