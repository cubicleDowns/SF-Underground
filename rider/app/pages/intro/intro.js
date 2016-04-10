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
    this.Data = _BoilerVR.Data;
  }

  openSettingsModal() {
    var modal = Modal.create(SettingsModal);
    this.nav.present(modal);
  }

}
