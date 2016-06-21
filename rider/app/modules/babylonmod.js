import {BartVR_HeadsUpDisplay} from './hud/BartVR_HeadsUpDisplay';
import {GazeEvent} from './events/gazeevent';
import {specialFX} from './specialFX';



/**
 * ...
 * @author Brendon Smith
 * http://seacloud9.org
 */

export class babylonMod {

    constructor(_element, _data, _app) {
        this.canvas = document.getElementById('renderCanvas');
        this.playerSprite = null;
        this.Data = _data;
        this.app = _app;
        this.vrCamera = null;
        this.colliderCap = null;
        this.ground = null;
        this.nonVRCamera = null;
        this.activeCamera = null;
        this.mode = 'normal';
        this.hud = null;
        this.scene = null;
        this.spManager = null;
        this.updateFunctionsInLoop = [];
        this.updateFunctionBeforeLoop = [];
        this.sprites = [];
        this.Data.babylonMod = this;
        this.distortionLens = null;
        this.specialFXBart = null;
        this.glitchEnabled = false;
        this.inertiaSpeed = null;
        this.rotationSpeed = null;
        this.initZombie = false;
        this.barTripping = false;
        setTimeout(this.init.bind(this), 500);
    }

    init() {
        window._babylon = this;   
        try{
            document.querySelector("ion-page").style.zIndex = 'auto';
            document.querySelector("scroll-content").style.webkitOverflowScrolling = 'auto';
            document.querySelector("scroll-content").style.willChange = 'auto';
            document.querySelector("scroll-content").style.zIndex = 'auto';
        }catch(e){}
        
        this.engine = new BABYLON.Engine(this.canvas , true);
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        BABYLON.SceneLoader.ShowLoadingScreen = false;
        BABYLON.SceneLoader.Load('', 'bartvr/scenes/subway3/bart_17.babylon?once=3665092109', this.engine, function(newScene) {
            this.scene = newScene;
            var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(100, 100, 0), this.scene );

            /*
            if(!this.app._isDesktop && this.app._platform.is('android')){
                BABYLON.SceneOptimizer.OptimizeAsync(this.scene, BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed(),
                function() {
                }.bind(this), function() {
                }.bind(this));
            }
            */

            document.getElementById('loadCover').style.display = "none";
            this.vrCamera = new BABYLON.VRDeviceOrientationFreeCamera("Camera", BABYLON.Vector3.Zero(), this.scene, true);
            this.vrCamera.rotation = new BABYLON.Vector3(newScene.cameras[0].rotation.x, newScene.cameras[0].rotation.y, newScene.cameras[0].rotation.z)
            this.vrCamera.attachControl(this.canvas, true);
            this.vrCamera.checkCollisions = true;
            this.vrCamera.applyGravity = true;
            this.activeCamera = this.vrCamera;
            this.nonVRCamera = new BABYLON.VirtualJoysticksCamera("VJC", BABYLON.Vector3.Zero(), this.scene);
            this.nonVRCamera.checkCollisions = this.scene.activeCamera.checkCollisions;
            this.nonVRCamera.applyGravity = this.scene.activeCamera.applyGravity;
            this.nonVRCamera.attachControl(this.canvas, false);
            this.inertiaSpeed  = this.app._platform.is('android') ? 0.6 : 0.7;
            this.rotationSpeed  = this.app._platform.is('android') ? 4 : 2;
            this.nonVRCamera.inputs.attached.virtualJoystick._rightjoystick.reverseUpDown = true;
            this.nonVRCamera.inputs.attached.virtualJoystick._rightjoystick._rotateOnAxisRelativeToMesh = true;
            
            this.nonVRCamera.inputs.attached.virtualJoystick.camera.inertia = this.inertiaSpeed;
            this.nonVRCamera.inputs.attached.virtualJoystick._rightjoystick._inverseRotationSpeed = this.rotationSpeed;
            this.nonVRCamera.inputs.attached.virtualJoystick._rightjoystick._rotationSpeed = this.rotationSpeed ;

          
            this.scene.activeCamera = this.nonVRCamera;
            this.vrCamera.position.x = 7;
            this.vrCamera.applyGravity = true;
            this.vrCamera.checkCollisions = true;
            this.Data.setUser(null, this.vrCamera.position);
            this.nonVRCamera.position =  this.vrCamera.position;

            if( ! this.app._platform.is('android') ){
                this.hud = new BartVR_HeadsUpDisplay(this.scene, this);
            }
            
            this.spManager  = new BABYLON.SpriteManager("userManager", this.Data.user.sprite, 1000, 128, this.scene);
            this.spManager.layerMask = 3;
            this.playerSprite = new BABYLON.Sprite("player", this.spManager );
            this.playerSprite.isPickable = true;

            

            if(this.Data.zombieMode){
                this.playerSprite.playAnimation( 80,  100, true, 100);
            }else{
                this.playerSprite.playAnimation(Math.abs( 20 - this.Data.user.spriteID),  parseInt(this.Data.user.spriteID), true, 100);
            }
            this.scene.activeCamera.position = new BABYLON.Vector3(this.Data.user.position.x, this.Data.user.position.y, this.Data.user.position.z);
            this.playerSprite.position = new BABYLON.Vector3(this.Data.user.position.x, this.Data.user.position.y, this.Data.user.position.z);
           // this.scene.activeCamera.rotation = new BABYLON.Vector3(this.Data.user.rotation.x, this.Data.user.rotation.y, this.Data.user.rotation.z);
            this.sprites.push({sprite:this.playerSprite, key:this.Data.currentUserKey});
            this.skyBox('oakland');


            this.ground = BABYLON.Mesh.CreateGround("ground1", 300, 300, 10, this.scene);
            this.ground.isVisible = false;
            this.ground.position.y = 8;
            this.ground.checkCollisions = true;
            this.scene.collisionsEnabled = true;
            this.scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
            // take that all you bart jumpers next time go find a bridge
            var groundColliderVert1 = BABYLON.Mesh.CreateGround("groundColliderVert1", 10, 10, 2, this.scene);
            groundColliderVert1.rotation.z = 1.556;
            groundColliderVert1.position = new BABYLON.Vector3(0, 10, 4.5);
            groundColliderVert1.scaling = new BABYLON.Vector3(4, 11, 5);
            groundColliderVert1.backFaceCulling = false;
            groundColliderVert1.checkCollisions = true;
            groundColliderVert1.isVisible = false;

            var groundColliderVert2 = BABYLON.Mesh.CreateGround("groundColliderVert2", 10, 10, 2, this.scene);
            groundColliderVert2.rotation.z = 1.556;
            groundColliderVert2.rotation.y = 3.14159;
            groundColliderVert2.position = new BABYLON.Vector3(-110, 10, 4.5);
            groundColliderVert2.scaling = new BABYLON.Vector3(4, 11, 5);
            groundColliderVert2.backFaceCulling = false;
            groundColliderVert2.checkCollisions = true;
            groundColliderVert2.isVisible = false;


            var groundColliderVert3 = BABYLON.Mesh.CreateGround("groundColliderVert3", 10, 10, 2, this.scene);
            groundColliderVert3.rotation.z = 1.556;
            groundColliderVert3.rotation.y = 1.556;
            groundColliderVert3.position = new BABYLON.Vector3(-40, 10, -9);
            groundColliderVert3.scaling = new BABYLON.Vector3(4, 11, 20);
            groundColliderVert3.backFaceCulling = false;
            groundColliderVert3.checkCollisions = true;
            groundColliderVert3.isVisible = false;
          
            var groundColliderVert4 = BABYLON.Mesh.CreateGround("groundColliderVert4", 10, 10, 2, this.scene);
            groundColliderVert4.rotation.z = 1.556;
            groundColliderVert4.rotation.y = -1.556;
            groundColliderVert4.position = new BABYLON.Vector3(-40, 10, 18);
            groundColliderVert4.scaling = new BABYLON.Vector3(4, 11, 20);
            groundColliderVert4.backFaceCulling = false;
            groundColliderVert4.checkCollisions = true;
            groundColliderVert4.isVisible = false;

            //this.nonVRCamera.ellipsoid =  new BABYLON.Vector3(6, 6, 6);
            this.nonVRCamera.applyGravity = true;
            /*
            for (let m = 0; m < this.scene.meshes.length; m++) {
                this.scene.meshes[m].checkCollisions = true;
            }
            */
        
            for(let i = 0; i < this.Data.currentRiders.length; i++){
                if(this.Data.currentRouteID == parseInt(this.Data.currentRiders[i].data.routeID)){
                    if(this.Data.currentRiders[i].key != this.Data.currentUserKey){
                        this.generateUserSprites(this.Data.currentRiders[i], i);
                    }
                    
                }
            }
            if(this.Data.executeUserRemoval != null){
                this.Data.deleteUser(this.Data.executeUserRemoval);
            }
            this.updateFunctionsInLoop.push((function(){
                this.vrCamera.position = this.scene.activeCamera.position;
                this.nonVRCamera.position = this.scene.activeCamera.position;
                this.playerSprite.position =  this.scene.activeCamera.position;
                this.Data.updateUser(this.scene.activeCamera.position, this.scene.activeCamera.rotation);

                if(this.glitchEnabled && !this.barTripping){
                    this.barTripping = true;
                    let toast = this.app._toast.create({
                        message: 'Bart Tripping Unlocked',
                        duration: 1500
                    });
                    this.app._nav.present(toast);

                }


                if(!this.initZombie && this.Data.zombieMode){
                    this.initZombie = true;
                    let toast = this.app._toast.create({
                        message: 'Zombie Mode Unlocked',
                        duration: 1500
                    });
                    this.app._nav.present(toast);

                }

                for(let i = 0; i < this.Data.currentRiders.length; i++){
                    if(this.Data.currentRouteID == parseInt(this.Data.currentRiders[i].data.routeID)){
                        if(this.Data.currentRiders[i].key != this.Data.currentUserKey){
                                if(! this.spriteDoesNotExist(this.Data.currentRiders[i].key, this.sprites)){
                                    this.generateUserSprites(this.Data.currentRiders[i], i);
                                }else{
                                    this.updateUserSprites(this.Data.currentRiders[i], i);
                                }
                        }
                    }
                }
            }.bind(this)));


            for(let i = 0; i < this.updateFunctionBeforeLoop.length; i++){
                this.updateFunctionBeforeLoop[i]();
            }
            this.gameLoop();
        
         }.bind(this), function(progress) {
            // To do: give progress feedback to user
        }.bind(this));

    }

    applyCameraChange(){
            this.scene.activeCamera = this.nonVRCamera;
            this.nonVRCamera.checkCollisions = this.scene.activeCamera.checkCollisions;
            this.nonVRCamera.applyGravity = this.scene.activeCamera.applyGravity;
            this.nonVRCamera.attachControl(this.canvas);
            this.nonVRCamera.inputs.attached.virtualJoystick._rightjoystick.reverseUpDown = true;
            this.nonVRCamera.inputs.attached.virtualJoystick._rightjoystick._rotateOnAxisRelativeToMesh = true;
            this.nonVRCamera.inputs.attached.virtualJoystick.camera.inertia = this.inertiaSpeed;
            this.nonVRCamera.inputs.attached.virtualJoystick._rightjoystick._inverseRotationSpeed = this.rotationSpeed ;
            this.nonVRCamera.inputs.attached.virtualJoystick._rightjoystick._rotationSpeed = this.rotationSpeed;
    }

    enableDistotion(){
        this.specialFXBart = new specialFX(this);
    }

    gameLoop(){
         this.scene.executeWhenReady(function() {
            this.engine.runRenderLoop(function() {
                if((!this.glitchEnabled && this.Data.soundStart && this.hud == null) || (!this.glitchEnabled && this.Data.soundStart && this.hud.hasInitalized)){
                    this.glitchEnabled = true;
                    this.enableDistotion();
                }

                if(this.glitchEnabled && !this.Data.soundStart){
                    this.specialFXBart.disableAllCameraDistortion();
                    this.specialFXBart.disableAllCameraDistortion();
                }
                document.getElementById("hudDBLevel").innerHTML = "DB:" + this.Data.dbLevel; 
                for(let i=0; i < this.updateFunctionsInLoop.length; i++){
                    this.updateFunctionsInLoop[i]();
                }
                this.scene.render();
            }.bind(this));
        }.bind(this));
    }

    spriteDoesNotExist(value, array) {
        var found = false;
        for(var i = 0; i < array.length; i++) {
            if (array[i].key == value) {
                return found = true;
                break;
            }
        }
        return found;
    }


    updateUserSprites(_data){
        for(var i = 0; i < this.sprites.length; i++) {
            if (_data.key == this.sprites[i].key) {
                if(this.Data.zombieMode){
                        this.sprites[i].sprite.playAnimation( 80,  100, true, 100);
                    }else{
                        this.sprites[i].sprite.playAnimation(Math.abs( 20 - parseInt(_data.data.spriteID)),  parseInt(_data.data.spriteID), true, 100);
                    }
                this.sprites[i].sprite.position =  _data.data.position;
                break;
            }
        }
    }

    generateUserSprites(_data, _id){
        var spriteManagerRider = new BABYLON.SpriteManager(_data.key, _data.data.sprite, 1, 128, this.scene);
        spriteManagerRider.layerMask = 3;
        spriteManagerRider.texture = this.spManager.texture.clone();
        let player = new BABYLON.Sprite(_data.key, spriteManagerRider );
        player.isPickable = true;
        player.position = _data.data.position;
        //player.rotation = _data.data.rotation;
        player.size = 14.0;
        if(this.Data.zombieMode){
            player.playAnimation( 80,  100, true, 100);
        }else{
            player.playAnimation(Math.abs( 20 - parseInt(_data.data.spriteID)),  parseInt(_data.data.spriteID), true, 100);
        }
        
        this.sprites.push({sprite:player, key:_data.key});
    }

    skyBox(_type, _size = 5000.0) {
        try{
            this.skybox.dispose();
        }catch(e){}
        this.skybox = null;
        this.currentSkyBoxName = "bartvr/img/textures/" + _type;
        var skybox = BABYLON.Mesh.CreateBox("skybox", _size, this.scene);
        skybox.layerMask = 2;
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(this.currentSkyBoxName, this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        this.skybox = skybox;
    }
    
    toggle() {
        if (this.mode == 'normal') {
            this.mode = 'vr';
            if (this.scene != null) {
                if(this.hud != null){
                   this.scene.activeCameras[0] = this.vrCamera;
                    if(this.glitchEnabled){
                        this.specialFXBart.enableVR();  
                    }
                    
                }else{
                    this.scene.activeCamera = this.vrCamera;
                }
            }
        } else {
            this.mode = 'normal';
            if (this.scene != null) {
                if(this.hud != null){
                   this.scene.activeCameras[0] = this.nonVRCamera;
                }else{
                    this.scene.activeCamera = this.nonVRCamera;
                }
            }
        }
    }
}