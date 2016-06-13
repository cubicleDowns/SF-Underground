export class specialFX {


    constructor(babylonMod) {
        window.time = 0;
        this._babylonMod = babylonMod;
        this.specialFXPipeline = null;
        this.RGBShift = null;
        this.RGBShiftFX = null;
        this.FilmPostProcess = null;
        this.FilmPostProcessFX = null;
        this.BadTVPostProcessFX = null;
        this.BadTVPostProcess = null;
        this.fxArray = [];
        this.init();
    }

    init(){
        this.specialFXPipeline = new BABYLON.PostProcessRenderPipeline(this._babylonMod.scene.getEngine(), "specialFXPipeline");

        this.RGBShift = new BABYLON.PostProcessRenderEffect(this._babylonMod.scene.getEngine(), "RGBShift",
                 function() {
                  this.RGBShiftFX = new BABYLON.RGBShiftPostProcess( "RGBShiftFX", null,  this._babylonMod.scene.activeCameras[0]);
                  this.RGBShiftFX._isRunning = true;
                  this.fxArray.push(this.RGBShiftFX);
                  return this.RGBShiftFX ;
        }.bind(this));
        this.RGBShift._isAttached = false;
        
        this.FilmPostProcess = new BABYLON.PostProcessRenderEffect(this._babylonMod.scene.getEngine(), "FilmPostProcess",
                 function() {
                   this.FilmPostProcessFX = new BABYLON.FilmPostProcess( "FilmPostProcessFX", null, new BABYLON.PassPostProcess("Scene copy", 1.0, this._babylonMod.scene.activeCameras[0]),  this._babylonMod.scene.activeCameras[0]);
                   this.FilmPostProcessFX._isRunning = true;
                   //this.FilmPostProcessFX.grayscale = false;
                   this.fxArray.push(this.FilmPostProcessFX);
                   return this.FilmPostProcessFX;
        }.bind(this));
        this.FilmPostProcess._isAttached = true;

        this.BadTVPostProcess = new BABYLON.PostProcessRenderEffect(this._babylonMod.scene.getEngine(), "BadTVPostProcess",
                 function() {
                    this.BadTVPostProcessFX = new BABYLON.BadTVPostProcess( "BadTVPostProcessFX", null, new BABYLON.PassPostProcess("Scene copy", 1.0, this._babylonMod.scene.activeCameras[0]),  this._babylonMod.scene.activeCameras[0]);
                    this.BadTVPostProcessFX._isRunning = true;
                    this.fxArray.push(this.BadTVPostProcessFX);
                    return this.BadTVPostProcessFX ;
        }.bind(this));
        this.BadTVPostProcess._isAttached = false;

        this.specialFXPipeline.addEffect(this.FilmPostProcess);

        this.specialFXPipeline.addEffect(this.BadTVPostProcess);
        this.specialFXPipeline.addEffect(this.RGBShift);

        

        this._babylonMod.scene.postProcessRenderPipelineManager.addPipeline(this.specialFXPipeline);


        this._babylonMod.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(this.specialFXPipeline._name, this._babylonMod.scene.activeCameras[0]);
        this._babylonMod.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(this.specialFXPipeline._name, this._babylonMod.nonVRCamera);
        this._babylonMod.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(this.specialFXPipeline._name, this._babylonMod.vrCamera);
        this.disableEffectInPipeline(this.BadTVPostProcess);
        this.disableEffectInPipeline(this.RGBShift);
        


        this._babylonMod.scene.registerBeforeRender(function () {
            try{

                
                

                if(this._babylonMod.Data.frequencyLevel > 0.2){
                   this.FilmPostProcessFX.grayscale = true;
                   this.disableEffectInPipeline(this.BadTVPostProcess);
                   this.disableEffectInPipeline(this.RGBShift);
                }

                if(this._babylonMod.Data.frequencyLevel > 0.35){
                    this.FilmPostProcessFX.grayscale = false;
                    this.enableEffectInPipeline(this.RGBShift);    
                    this.disableEffectInPipeline(this.BadTVPostProcess);

                }

                if(this._babylonMod.Data.frequencyLevel > 0.35){
                        this.enableEffectInPipeline(this.BadTVPostProcess);
                        this.enableEffectInPipeline(this.RGBShift);
                }
                window.time += 0.01;
                this.BadTVPostProcessFX.time =  this.FilmPostProcessFX.time  = window.time;

            }catch(e){
               // console.log(e);
            }
        }.bind(this));

    }

    enableEffectInPipeline(_postProcess){
        this._babylonMod.scene.postProcessRenderPipelineManager.enableEffectInPipeline(this.specialFXPipeline._name, _postProcess._name, this._babylonMod.scene.activeCameras[0]);
        this._babylonMod.scene.postProcessRenderPipelineManager.enableEffectInPipeline(this.specialFXPipeline._name, _postProcess._name, this._babylonMod.nonVRCamera);
        this._babylonMod.scene.postProcessRenderPipelineManager.enableEffectInPipeline(this.specialFXPipeline._name, _postProcess._name, this._babylonMod.vrCamera );
    }

    disableEffectInPipeline(_postProcess){
        this._babylonMod.scene.postProcessRenderPipelineManager.disableEffectInPipeline(this.specialFXPipeline._name, _postProcess._name, this._babylonMod.scene.activeCameras[0]);
        this._babylonMod.scene.postProcessRenderPipelineManager.disableEffectInPipeline(this.specialFXPipeline._name, _postProcess._name, this._babylonMod.nonVRCamera);
        this._babylonMod.scene.postProcessRenderPipelineManager.disableEffectInPipeline(this.specialFXPipeline._name, _postProcess._name, this._babylonMod.vrCamera );
    }


    disableDistortion(camera){
        try{
            for(let i =0; i < camera._postProcesses.length; i++){
                camera.detachPostProcess(camera._postProcesses[i]);
            }
        }catch(e){
            console.log(e);
        }
    }

    disableAllCameraDistortion(){
        this.disableDistortion(this._babylonMod.scene.activeCameras[0]);
        this.disableDistortion(this._babylonMod.nonVRCamera);
        this.disableDistortion(this._babylonMod.vrCamera);
    }

    disableEffect(_porcess){
        _porcess._isRunning = false;
        this._babylonMod.scene.activeCameras[0].detachPostProcess(_porcess);
        this._babylonMod.nonVRCamera.detachPostProcess(_porcess);
        this._babylonMod.vrCamera.detachPostProcess(_porcess);
    }

    enableEffect(_porcess){
        this._babylonMod.scene.activeCameras[0].attachPostProcess(_porcess);
        this._babylonMod.nonVRCamera.attachPostProcess(_porcess);
        this._babylonMod.vrCamera.attachPostProcess(_porcess);
    }

    soundFX(){

    }
}