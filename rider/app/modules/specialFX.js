export class specialFX {


    constructor(babylonMod) {
        window.time = 0;
        this._babylonMod = babylonMod;
        this.specialFXPipeline = null;
        this.RGBShift = null;
        this.RGBShiftFX = null;
        this.FilmPostProcess = null;
        this.BadTVPostProcess = null;
        this.init();
    }





    init(){
        this.specialFXPipeline = new BABYLON.PostProcessRenderPipeline(this._babylonMod.scene.getEngine(), "specialFXPipeline");

        this.RGBShift = new BABYLON.PostProcessRenderEffect(this._babylonMod.scene.getEngine(), "RGBShift",
                 function() {
                  this.RGBShiftFX = new BABYLON.RGBShiftPostProcess( "RGBShiftFX", null,  this._babylonMod.scene.activeCameras[0])
                  return this.RGBShiftFX ;
        }.bind(this));
        

        this.FilmPostProcess = new BABYLON.PostProcessRenderEffect(this._babylonMod.scene.getEngine(), "FilmPostProcess",
                 function() {
                  return new BABYLON.FilmPostProcess( "FilmPostProcessFX", null, new BABYLON.PassPostProcess("Scene copy", 1.0, this._babylonMod.scene.activeCameras[0]),  this._babylonMod.scene.activeCameras[0]);
        }.bind(this));

        this.BadTVPostProcess = new BABYLON.PostProcessRenderEffect(this._babylonMod.scene.getEngine(), "BadTVPostProcess",
                 function() {
                  return new BABYLON.BadTVPostProcess( "BadTVPostProcessFX", null, new BABYLON.PassPostProcess("Scene copy", 1.0, this._babylonMod.scene.activeCameras[0]),  this._babylonMod.scene.activeCameras[0]);
        }.bind(this));

        this.specialFXPipeline.addEffect(this.FilmPostProcess);
        this.specialFXPipeline.addEffect(this.BadTVPostProcess);
        this.specialFXPipeline.addEffect(this.RGBShift);
        this._babylonMod.scene.postProcessRenderPipelineManager.addPipeline(this.specialFXPipeline);
        this._babylonMod.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("specialFXPipeline", this._babylonMod.scene.activeCameras[0]);
        this._babylonMod.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("specialFXPipeline", this._babylonMod.nonVRCamera);
        this._babylonMod.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("specialFXPipeline", this._babylonMod.vrCamera);


        this._babylonMod.scene.registerBeforeRender(function () {
                window.time += 0.01;
                this.BadTVPostProcess._postProcesses[0].time =  this.FilmPostProcess._postProcesses[0].time  = window.time;
        }.bind(this));
        console.log('hit??');
    }

    disableEffect(_porcess){

    }

    enableEffect(_porcess){

    }

    soundFX(){

    }
}