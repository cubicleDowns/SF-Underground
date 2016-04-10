import {Page, Modal, ViewController} from 'ionic-angular';
import {BoilerVR} from '../../app';

@Page({
  templateUrl: 'build/pages/settings/settings.html'
})
export class SettingsModal {
  static get parameters() {
    return [[ViewController], [BoilerVR]];
  }
  constructor(viewCtrl, _BoilerVR) {
    this.viewCtrl = viewCtrl;
    this.babylonMod = _BoilerVR.babylonMod;
    this.Data = _BoilerVR.Data;
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }

  toggle(){
    this.babylonMod.toggle();
  }

}