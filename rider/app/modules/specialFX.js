
/**
 * ...
 * @author Brendon Smith
 * http://seacloud9.org
 */


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
        this.pixelatePostProcessScreen = null;
        this.pixelatePostProcessFX = null;
        this.fxArray = [];
        this.copyPass = null;
        this.init();
    }

    init(){

        this.copyPass = new BABYLON.PassPostProcess("Scene copy", 1.0, (this._babylonMod.hud != null?  this._babylonMod.scene.activeCameras[0] : this._babylonMod.scene.activeCamera));
        this.specialFXPipeline = new BABYLON.PostProcessRenderPipeline(this._babylonMod.scene.getEngine(), "specialFXPipeline");
        this.RGBShift = new BABYLON.PostProcessRenderEffect(this._babylonMod.scene.getEngine(), "RGBShift",
                 function() {
                  this.RGBShiftFX = new BABYLON.RGBShiftPostProcess( "RGBShiftFX", null,   (this._babylonMod.hud != null?  this._babylonMod.scene.activeCameras[0] : this._babylonMod.scene.activeCamera));
                  this.RGBShiftFX._isRunning = true;
                  this.fxArray.push(this.RGBShiftFX);
                  return this.RGBShiftFX ;
        }.bind(this));
        this.RGBShift._isAttached = false;

        this.FilmPostProcess = new BABYLON.PostProcessRenderEffect(this._babylonMod.scene.getEngine(), "FilmPostProcess",
                 function() {
                   this.FilmPostProcessFX = new BABYLON.FilmPostProcess( "FilmPostProcessFX", null, this.copyPass, this._babylonMod.hud != null?  this._babylonMod.scene.activeCameras[0] : this._babylonMod.scene.activeCamera);
                   this.FilmPostProcessFX._isRunning = true;
                   this.fxArray.push(this.FilmPostProcessFX);
                   return this.FilmPostProcessFX;
        }.bind(this));

        this.FilmPostProcess._isAttached = true;

        this.BadTVPostProcess = new BABYLON.PostProcessRenderEffect(this._babylonMod.scene.getEngine(), "BadTVPostProcess",
                 function() {
                    this.BadTVPostProcessFX = new BABYLON.BadTVPostProcess( "BadTVPostProcessFX", null, this.copyPass,  this._babylonMod.hud != null?  this._babylonMod.scene.activeCameras[0] : this._babylonMod.scene.activeCamera);
                    this.BadTVPostProcessFX._isRunning = true;
                    //this.BadTVPostProcessFX.rollSpeed = 0.0;
                    this.fxArray.push(this.BadTVPostProcessFX);
                    return this.BadTVPostProcessFX ;
        }.bind(this));


        this.pixelatePostProcessScreen = new BABYLON.PostProcessRenderEffect(this._babylonMod.scene.getEngine(), "pixelatePostProcessScreen",
                 function() {
                    this.PixelatePostProcessFX = new BABYLON.PixelatePostProcess( "PixelatePostProcessFX", null, this.copyPass,  this._babylonMod.hud != null?  this._babylonMod.scene.activeCameras[0] : this._babylonMod.scene.activeCamera);
                    this.PixelatePostProcessFX._isRunning = true;
                    this.PixelatePostProcessFX.dimensions = new BABYLON.Vector4(this._babylonMod.scene.getEngine().getRenderWidth(), this._babylonMod.scene.getEngine().getRenderHeight(), 0.0, 0.0);
                    this.PixelatePostProcessFX.pixelSize = new BABYLON.Vector2(60.0, 60.0); 
                    this.fxArray.push(this.PixelatePostProcessFX);
                    window.onresize = function(){
                        try{
                            this.PixelatePostProcessFX.dimensions = new BABYLON.Vector4(this._babylonMod.scene.getEngine().getRenderWidth(), this._babylonMod.scene.getEngine().getRenderHeight(), 0.0, 0.0);
                        }catch(e){}
                    }.bind(this);
                    return this.PixelatePostProcessFX ;
        }.bind(this));


        //this.BadTVPostProcess._isAttached = false;
        this.specialFXPipeline.addEffect(this.FilmPostProcess);
        this.specialFXPipeline.addEffect(this.BadTVPostProcess);
        this.specialFXPipeline.addEffect(this.RGBShift);
        this.specialFXPipeline.addEffect(this.pixelatePostProcessScreen);


        

        this._babylonMod.scene.postProcessRenderPipelineManager.addPipeline(this.specialFXPipeline);

        if(this._babylonMod.hud != null){
            this._babylonMod.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(this.specialFXPipeline._name, this._babylonMod.scene.activeCameras[0]);
        }
        
        this._babylonMod.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(this.specialFXPipeline._name, this._babylonMod.nonVRCamera);
        this._babylonMod.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(this.specialFXPipeline._name, this._babylonMod.vrCamera);
        this.disableEffectInPipeline(this.BadTVPostProcess);
        this.disableEffectInPipeline(this.RGBShift);

        this._babylonMod.scene.registerBeforeRender(function () {
            try{

                window.time += 0.01;
                if(window.time < 2.5){
                    let meh = window.time * 0.1 * 1;
                    this.PixelatePostProcessFX.pixelSize = new BABYLON.Vector2(60.0 - meh, 60.0 - meh); 
                }else{
                    this.disableEffectInPipeline(this.pixelatePostProcessScreen);
                }

                this.RGBShiftFX.amount =  this._babylonMod.Data.frequencyLevel * 0.1;
                this.FilmPostProcessFX.nIntensity =  this._babylonMod.Data.frequencyLevel  * 0.1;

                if(this._babylonMod.Data.frequencyLevel < 0.1){
                   this.disableEffectInPipeline(this.FilmPostProcess);
                   this.disableEffectInPipeline(this.BadTVPostProcess);
                   this.disableEffectInPipeline(this.RGBShift); 
                }

                if(this._babylonMod.Data.frequencyLevel > 0.1){
                   this.FilmPostProcessFX.grayscale = false;
                   this.disableEffectInPipeline(this.BadTVPostProcess);
                   this.disableEffectInPipeline(this.RGBShift);
                }

                if(this._babylonMod.Data.frequencyLevel > 0.2){
                    this.FilmPostProcessFX.grayscale = true;
                    this.enableEffectInPipeline(this.RGBShift);    
                    this.disableEffectInPipeline(this.BadTVPostProcess);
                }

                if(this._babylonMod.Data.frequencyLevel > 0.25){
                        this.enableEffectInPipeline(this.BadTVPostProcess);
                        this.enableEffectInPipeline(this.RGBShift);
                        this.BadTVPostProcessFX.rollSpeed = this._babylonMod.Data.frequencyLevel;
                }
                
                
                this.BadTVPostProcessFX.time =  this.FilmPostProcessFX.time  = window.time;

            }catch(e){
                console.log(e);
            }
        }.bind(this));

    }

    enableEffectInPipeline(_postProcess){
        if(this._babylonMod.hud != null){
            this._babylonMod.scene.postProcessRenderPipelineManager.enableEffectInPipeline(this.specialFXPipeline._name, _postProcess._name, this._babylonMod.scene.activeCameras[0]);
        }
        this._babylonMod.scene.postProcessRenderPipelineManager.enableEffectInPipeline(this.specialFXPipeline._name, _postProcess._name, this._babylonMod.nonVRCamera);
        this._babylonMod.scene.postProcessRenderPipelineManager.enableEffectInPipeline(this.specialFXPipeline._name, _postProcess._name, this._babylonMod.vrCamera );
    }

    disableEffectInPipeline(_postProcess){
        if(this._babylonMod.hud != null){
            this._babylonMod.scene.postProcessRenderPipelineManager.disableEffectInPipeline(this.specialFXPipeline._name, _postProcess._name, this._babylonMod.scene.activeCameras[0]);
        }
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
        if(this._babylonMod.hud != null){
            this.disableDistortion(this._babylonMod.scene.activeCameras[0]);
        }
        
        this.disableDistortion(this._babylonMod.nonVRCamera);
        this.disableDistortion(this._babylonMod.vrCamera);
    }

    enableVR(){
        this.disableDistortion(this._babylonMod.vrCamera);
    }

    disableEffect(_porcess){
        _porcess._isRunning = false;
        if(this._babylonMod.hud != null){
            this._babylonMod.scene.activeCameras[0].detachPostProcess(_porcess);
        }
        
        this._babylonMod.nonVRCamera.detachPostProcess(_porcess);
        this._babylonMod.vrCamera.detachPostProcess(_porcess);
    }

    enableEffect(_porcess){
        if(this._babylonMod.hud != null){
            this._babylonMod.scene.activeCameras[0].attachPostProcess(_porcess);
        }
        this._babylonMod.nonVRCamera.attachPostProcess(_porcess);
        this._babylonMod.vrCamera.attachPostProcess(_porcess);
    }



}