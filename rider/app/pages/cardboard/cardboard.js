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
          document.querySelector("ion-page").style.zIndex = 'auto';
          document.querySelector("scroll-content").style.webkitOverflowScrolling = 'auto';
          document.querySelector("scroll-content").style.willChange = 'auto';
          document.querySelector("scroll-content").style.zIndex = 'auto';

        
   

        this.Data.landscapeMode = true;
        this.Data.stereoEffect = false;
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
          document.querySelector("ion-page").style.zIndex = '100';
          document.querySelector("scroll-content").style.webkitOverflowScrolling = 'touch';
          document.querySelector("scroll-content").style.willChange = 'scroll-position';
          document.querySelector("scroll-content").style.zIndex = '1';



        


      }
    }
    window.addEventListener('orientationchange', readDeviceOrientation.bind(this), false);
  }

}