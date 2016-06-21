import {Page, Modal, ViewController} from 'ionic-angular';
import {BoilerVR} from '../../app';


/**
 * ...
 * @author Brendon Smith
 * http://seacloud9.org
 */


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
    document.getElementById("cardBoardView").style.display = "block";
    document.getElementById('cardboardControls').style.display = "block";
  }

  toggle(){
    this.babylonMod.toggle();
  }

}