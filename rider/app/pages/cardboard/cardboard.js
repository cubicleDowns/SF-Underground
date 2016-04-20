import {App, IonicApp, Page, Template} from 'ionic-angular';
import {Directive, Component, ElementRef} from 'angular2/core';
import {babylonMod} from '../../modules/babylonmod'; 
import {BoilerVR} from '../../app';

@Component({
  selector: 'cardboardgl',
  templateUrl: "build/pages/cardboard/cardboard.html"
})   


export class CardboardGl{
  
  static get parameters() {
    return [[ElementRef], [BoilerVR]];
  }

  constructor (_element, _boilerVR) {
  	this._element = _element;
  	this._babylon = null;
    this.Data = _boilerVR.Data;
    this.app = _boilerVR;
    this.init();
    this.isStereoEffect = false;
    this.inLandScape = false;
    this.boilerVR = _boilerVR;
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
        // Landscape
        if(this.boilerVR.isNative){
          Vibrate(50);
        }

        this.Data.landscapeMode = true;
        this.Data.stereoEffect = true;

        if(this._engine  == null){
         this._babylon = new babylonMod(this._element.nativeElement, this.Data, this.app);
         this.boilerVR.babylonMod = this._babylon;
        }
      } else {
        // Portrait
        if(this.boilerVR.isNative){
          Vibrate(50);
        }
        this.Data.landscapeMode = false;
        this.Data.stereoEffect = false;
      }
      //this.isVisible();
    }
    window.addEventListener('orientationchange', readDeviceOrientation.bind(this), false);
  }

}