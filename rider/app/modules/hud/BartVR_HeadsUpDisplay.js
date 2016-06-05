import {HUDSystem} from './hudsystem';
import {HUDPanel} from './hudpanel';

export class BartVR_HeadsUpDisplay {

    constructor(scene, babylonMod) {
        this.assets = [];
        this._scene = scene;
        this.babylonMod = babylonMod;
        this.engine  = this._scene.getEngine();
        this.loader = new BABYLON.AssetsManager(scene);
        this.hudsystem = null;
        this.pWidth =  this.engine.getRenderWidth() / 2;
        this.pHeight =  this.engine.getRenderHeight() / 2;
        this.pW50 = this.pWidth / 2;
        this.logo;
        this.camTargetObjLeft;
        this.camTargetObjRight;


        this.toLoad = [
            {name : "logo", src : "bartvr/img/bartVRLogo_b.png" },
            {name : "targetCam", src: "bartvr/img/target_sm.png"}
        ];
        this.toLoad.forEach(function(obj) {
            var img = this.loader.addTextureTask(obj.name, obj.src);
            img.onSuccess = function(t) {
                this.assets[t.name] = t.texture;
            }.bind(this);
        }.bind(this));
        this.loader.onFinish = this.onFinish.bind(this);
        this.init();
    }

    init(){
        this.loader.load();
    }

    scaleCamTarget(amount = 200){
        this.camTargetObjLeft.mesh.scaling.x = amount;
        this.camTargetObjLeft.mesh.scaling.y = amount;
        this.camTargetObjRight.mesh.scaling.x = amount;
        this.camTargetObjRight.mesh.scaling.y = amount;
    }

    onVRPointers(){
            this.camTargetObjLeft = new HUDPanel("camTargetObjLeft", this.assets["targetCam"], this.assets["targetCam"],  this.hudsystem);
            this.camTargetObjLeft.guiposition(new BABYLON.Vector3((this.pW50 - 32), (this.pHeight - 32), 0));
            this.camTargetObjRight = new HUDPanel("camTargetObjRight", this.assets["targetCam"], this.assets["targetCam"],  this.hudsystem);
            this.camTargetObjRight.guiposition(new BABYLON.Vector3(((this.pWidth + this.pW50) - 32), (this.pHeight - 32), 0));
            this.hudsystem.updateCamera();
    }

    onVRDisableDisplay(){
        this.camTargetObjLeft = null;
        this.camTargetObjRight = null;
        this.hudsystem.updateCamera();
    }

    onFinish(){
        setTimeout(function() {
            var gui = new HUDSystem(this._scene, this.engine.getRenderWidth(), this.engine.getRenderHeight());
            this.logo = new HUDPanel("logo", this.assets["logo"], this.assets["logo"], gui);
            this.logo.guiposition(new BABYLON.Vector3(250, 100, 0));
 
           
            gui.updateCamera();
            this.hudsystem = gui;
        }.bind(this), 200);
    }

}