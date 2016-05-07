import {App, IonicApp, Page, NavController, NavParams, Modal, Component} from 'ionic-angular';
import {babylonMod} from '../../modules/babylonmod';
import {BoilerVR} from '../../app';
import {SettingsModal} from '../settings/settings';
import {CardboardGl} from '../cardboard/cardboard';

@Page({
  templateUrl: 'build/pages/intro/intro.html',
  directives: [CardboardGl]
})

export class IntroPage {

  static get parameters() {
    return [[IonicApp], [NavController], [NavParams], [BoilerVR]];
  }

  constructor(app, nav, navParams, _BoilerVR) {
  	this.nav = nav;
    this.app = app;
    this.bartVR = _BoilerVR;
    this.Data = _BoilerVR.Data;

    var infoReady = Promise.resolve(document.getElementById('userReg'));
        infoReady.then(() => {
           setTimeout(this.init.bind(this), 500);
        });

  }

  init(){
    if(window.localStorage.getItem("bart_vr_user") != null){
        document.getElementById('userReg').style.display = "none";
        document.getElementById('currentUser').style.display = "block";
        document.getElementById('userName').innerHTML  =  "Welcome back " + window.localStorage.getItem("bart_vr_user");
    }

  }

  openSettingsModal() {
    var modal = Modal.create(SettingsModal);
    this.nav.present(modal);
  }

   fullScreenLaunch(){
    this.bartVR.launchIntoFullscreen();
  }

}
