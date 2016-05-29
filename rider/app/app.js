import {App, IonicApp, Platform, NavController} from 'ionic-angular';
import {Component, View, bootstrap, NgFor} from '@angular/core';
import {CardBoardData} from './models/cardboarddata';
import {IntroPage} from './pages/intro/intro';
import {SettingsModal} from './pages/settings/settings';



@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})

export class BoilerVR {

  static get parameters() {
    return [[IonicApp], [Platform]];
  }

  constructor(app, platform) {
    window._bartVR = this;
    this.Data = new CardBoardData();
    this.app = app;
    this.babylonMod = null;
    this.isNative = false;

    this.pages = [
      { title: 'CardboardVR', component: IntroPage }
    ];

    this.rootPage = IntroPage;


    platform.ready().then(() => {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      //platform.fullScreen();
      if (window.StatusBar) {
        return StatusBar.hide();
      }
    });
  }

  initStayAwake(){
    function Insomnia() {
    }

    Insomnia.prototype.keepAwake = function (successCallback, errorCallback) {
      cordova.exec(successCallback, errorCallback, "Insomnia", "keepAwake", []);
    };

    Insomnia.prototype.allowSleepAgain = function (successCallback, errorCallback) {
      cordova.exec(successCallback, errorCallback, "Insomnia", "allowSleepAgain", []);
    };

    Insomnia.install = function () {
      if (!window.plugins) {
        window.plugins = {};
      }

      window.plugins.insomnia = new Insomnia();
      return window.plugins.insomnia;
    };

    cordova.addConstructor(Insomnia.install);
  }

  launchIntoFullscreen(element = document.documentElement) {
    if(typeof element.requestFullscreen != 'undefined') {
      element.requestFullscreen();
    } else if(typeof element.mozRequestFullScreen != 'undefined') {
      element.mozRequestFullScreen();
    } else if(typeof element.webkitRequestFullscreen != 'undefined') {
      element.webkitRequestFullscreen();
    } else if(typeof element.msRequestFullscreen != 'undefined') {
      element.msRequestFullscreen();
    }
  }

  exitFullscreen() {
    if(typeof document.exitFullscreen != 'undefined') {
      document.exitFullscreen();
    } else if(typeof document.mozCancelFullScreen != 'undefined') {
      document.mozCancelFullScreen();
    } else if(typeof document.webkitExitFullscreen != 'undefined') {
      document.webkitExitFullscreen();
    }
  }


}
