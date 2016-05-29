import {App, IonicApp, Page, NavController, NavParams, Template,  Modal} from 'ionic-angular';
import {Directive, Component, ElementRef} from '@angular/core';
import {SettingsModal} from '../settings/settings';
import {babylonMod} from '../../modules/babylonmod'; 
import {BoilerVR} from '../../app';


@Component({
  selector: 'cardboardgl',
  templateUrl: "build/pages/cardboard/cardboard.html"
})   


export class CardboardGl{
  
  static get parameters() {
    return [[ElementRef], [BoilerVR], [NavController], [NavParams]];
  }

  constructor (_element, _boilerVR, nav, navParams) {
    this._element = _element;
    this.nav = nav;
    this._babylon = null;
    this.Data = _boilerVR.Data;
    this.app = _boilerVR;
    this.isStereoEffect = false;
    this.inLandScape = false;
    this.hasInit = false;
    this.init();
    this.boilerVR = _boilerVR;
  }

  openSettingsModal() {
    document.getElementById('cardboardControls').style.display = "none";
    document.getElementById("cardBoardView").style.display = "none";
    var modal = Modal.create(SettingsModal);
    this.nav.present(modal);
  }

  isVisible(){
    if(this.Data.landscapeMode && this.Data.stereoEffect){
      this.isStereoEffect = true;
    }else{
      this.isStereoEffect = false;
    }
  }

   init(){
    function readDeviceOrientation() {
      if (Math.abs(window.orientation) === 90) {
        document.getElementById("slidesView").style.visibility = "hidden";
        document.getElementById("cardBoardView").style.display = "block";
        this.Data.landscapeMode = true;
        this.Data.stereoEffect = true;
        if(this.hasInit  == false){
          this.hasInit = true;
          this._babylon = new babylonMod(this._element.nativeElement, this.Data, this.app);
          this.boilerVR.babylonMod = this._babylon;
        }
      } else {
        this.Data.landscapeMode = false;
        this.Data.stereoEffect = false;
        document.getElementById("slidesView").style.visibility = "visible";
        document.getElementById("cardBoardView").style.display = "none";
      }
    }
    window.addEventListener('orientationchange', readDeviceOrientation.bind(this), false);
  }

}