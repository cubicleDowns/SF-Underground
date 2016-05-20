export class babylonMod {

    constructor(_element, _data, _app) {
        this.canvas = document.getElementById('renderCanvas');
        this.playerSprite = null;
        this.Data = _data;
        this.app = _app;
        setTimeout(this.init.bind(this), 500);
        this.vrCamera = null;
        this.nonVRCamera = null;
        this.activeCamera = null;
        this.mode = 'vr';
        this.scene = null;
        this.updateFunctionsInLoop = [];
        this.updateFunctionBeforeLoop = [];
        this.sprites = [];
        this.Data.babylonMod = this;
    }

    init() {
        window._babylon = this;
        this.engine = new BABYLON.Engine(this.canvas , true);
        BABYLON.SceneLoader.Load('', 'build/scenes/subway3/bart_16.babylon?once=3665092109', this.engine, function(newScene) {
            this.scene = newScene;
            var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(100, 100, 0), this.scene );
            if(_babylon.app.isNative){
                BABYLON.SceneOptimizer.OptimizeAsync(this.scene, BABYLON.SceneOptimizerOptions.HighDegradationAllowed(),
                function() {
                  console.log(this.engine.getFps());
                }.bind(this), function() {
                   console.log(this.engine.getFps());
                }.bind(this));
            }

            document.getElementById('loadCover').style.display = "none";
            this.vrCamera = new BABYLON.VRDeviceOrientationFreeCamera("Camera", BABYLON.Vector3.Zero(), this.scene, true);
            this.vrCamera.rotation = new BABYLON.Vector3(newScene.cameras[0].rotation.x, newScene.cameras[0].rotation.y, newScene.cameras[0].rotation.z)
            this.vrCamera.attachControl(this.canvas, true);
            this.activeCamera = this.vrCamera;
            this.nonVRCamera = new BABYLON.VirtualJoysticksCamera("VJC", BABYLON.Vector3.Zero(), this.scene);
            this.nonVRCamera.attachControl(this.canvas, true);
            this.nonVRCamera.checkCollisions = this.scene.activeCamera.checkCollisions;
            this.nonVRCamera.applyGravity = this.scene.activeCamera.applyGravity;
            this.nonVRCamera.parent = this.vrCamera;  
            this.scene.activeCamera = this.vrCamera;
            this.vrCamera.position.x = 6;
            this.Data.setUser(null, this.vrCamera.position);

            var spriteManagerPlayer = new BABYLON.SpriteManager("riderManager", this.Data.user.sprite, 1, 128, this.scene);
            this.playerSprite = new BABYLON.Sprite("player", spriteManagerPlayer);
            this.playerSprite.isPickable = true;
            this.playerSprite.playAnimation(0, 20, true, 100);
            this.playerSprite.parent = this.vrCamera;
            this.sprites.push(this.playerSprite);
            this.skyBox('oakland');
          
            for(let i = 0; i < this.Data.currentRiders.length; i++){
                if(this.Data.currentRouteID == parseInt(this.Data.currentRiders[i].data.routeID)){
                    this.generateUserSprites(this.Data.currentRiders[i], i);
                }
            }
            

            if(this.Data.executeUserRemoval != null){
                this.Data.deleteUser(this.Data.executeUserRemoval);
            }
            this.updateFunctionsInLoop.push((function(){
                this.vrCamera.position = new BABYLON.Vector3(this.Data.user.position.x, this.Data.user.position.y, this.Data.user.position.z);
                this.playerSprite.position = new BABYLON.Vector3(this.Data.user.position.x, this.Data.user.position.y, this.Data.user.position.z);
                this.Data.updateUser(this.activeCamera.position, this.activeCamera.rotation);
            }.bind(this)));


            for(let i = 0; i < this.updateFunctionBeforeLoop.length; i++){
                this.updateFunctionBeforeLoop[i]();
            }
            this.gameLoop();

        
         }.bind(this), function(progress) {
            // To do: give progress feedback to user
        }.bind(this));
        

        /*
        window.addEventListener("resize", function() {
            this.engine.resize();
        });
        */

    }


    /*
    randomPos(min, max){
        return Math.random() * (max - min) + min;
    }
    */



    generateUserSprites(_data, _id){
        console.log(_data);
        var spriteManagerRider = new BABYLON.SpriteManager(_data.key, _data.data.sprite, 1, 128, this.scene);
        let player = new BABYLON.Sprite(_data.key, spriteManagerRider);
        player.isPickable = true;
        console.log(_data.data.position);
        player.position = _data.data.position;
        player.rotation = _data.data.rotation;
        player.size = 14.0;
        player.playAnimation(0, 20, true, 100);
    }

    skyBox(_type, _size = 5000.0) {
        try{
            this.skybox.dispose();
        }catch(e){}
        
        this.skybox = null;
        this.currentSkyBoxName = "build/img/textures/" + _type;
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


    gameLoop(){
         this.scene.executeWhenReady(function() {
            this.engine.runRenderLoop(function() {
                for(let i=0; i < this.updateFunctionsInLoop.length; i++){
                    this.updateFunctionsInLoop[i]();
                }
                this.scene.render();
            }.bind(this));
        }.bind(this));
    }

    toggle() {
        if (this.mode == 'vr') {
            this.mode = 'nomral';
            if (this.scene != null) {
                this.scene.activeCamera = this.nonVRCamera;
                this.activeCamera = this.nonVRCamera;
            }
        } else {
            this.mode = 'vr';
            if (this.scene != null) {
                this.scene.activeCamera = this.vrCamera;
                this.activeCamera = this.vrCamera;
            }
        }
    }
}