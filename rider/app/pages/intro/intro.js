import {App, IonicApp, Page, NavController, NavParams, Modal} from 'ionic-angular';
import {Directive, Component, ElementRef} from '@angular/core';
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
    this._babylon = null;
    this.hasInit = false;
    this.bartVR = _BoilerVR;
    this.Data = _BoilerVR.Data;

    

    var infoReady = Promise.resolve(document.getElementById('userReg'));
        infoReady.then(() => {
           setTimeout(this.init.bind(this), 500);
        });

  }

  goDesktop(){
        document.getElementById("slidesView").style.visibility = "hidden";
        document.getElementById("cardBoardView").style.display = "block";
       
        if(this.hasInit  == false){
          this.hasInit = true;
          this._babylon = new babylonMod(document.getElementById("cardBoardView"), this.Data, this.bartVR);
          this.bartVR.babylonMod = this._babylon;
        }
  }


  init(){

    if( this.bartVR._isDesktop ){
      document.getElementById('desktopLaunch').style.display = "block";
      document.getElementById('desktopLaunch1').style.display = "block";
      document.getElementById('rotateMessage').style.display = "none";
      document.getElementById('rotateMessage1').style.display = "none";

      
    }else{
      document.getElementById('desktopLaunch').style.display = "none";
      document.getElementById('desktopLaunch1').style.display = "none";
    }

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

  reset(){
   this.Data.executeUserRemoval = "bart_vr_user_key";
    window.localStorage.removeItem("bart_vr_user");
    window.localStorage.removeItem("bart_vr_user_key");
    document.getElementById('userReg').style.display = "block";
    document.getElementById('currentUser').style.display = "none";
  }

   fullScreenLaunch(){
    this.bartVR.launchIntoFullscreen();
  }

}
