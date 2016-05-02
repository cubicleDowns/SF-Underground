export class babylonMod {

    constructor(_element, _data, _app) {
        this.canvas = document.getElementById('renderCanvas');
        this.Data = _data;
        this.app = _app;
        setTimeout(this.init.bind(this), 500);
        this.vrCamera = null;
        this.nonVRCamera = null;
        this.activeCamera = null;
        this.mode = 'vr';
        this.scene = null;
        this.updateFunctionsInLoop = [];
        this.sprites = [];
        this.Data.babylonMod = this;
    }

    init() {
        window._babylon = this;
        this.engine = new BABYLON.Engine(this.canvas , true);
        //Create a light
        
        //Create an Arc Rotate Camera - aimed negative z this time
        

        BABYLON.SceneLoader.Load('', 'build/scenes/subway3/subway.babylon?once=366509210', this.engine, function(newScene) {
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
            this.vrCamera = new BABYLON.VRDeviceOrientationFreeCamera("Camera", new BABYLON.Vector3(newScene.cameras[0].position.x, newScene.cameras[0].position.y, newScene.cameras[0].position.z), this.scene, true);
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
            var player = new BABYLON.Sprite("player", spriteManagerPlayer);
            player.isPickable = true;
            player.playAnimation(0, 20, true, 100);
            player.parent = this.vrCamera;
            this.sprites.push(player);
            this.skyBox('s');
          
            for(let i = 0; i < this.Data.currentRiders.length; i++){
                this.generateUserSprites(this.Data.currentRiders[i], i);
            }
            

            this.updateFunctionsInLoop.push((function(){
                this.Data.updateUser(this.activeCamera.position, this.activeCamera.rotation);
            }.bind(this)));

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
        var spriteManagerRider = new BABYLON.SpriteManager("riderManager", _data.sprite, 1, 128, this.scene);
        var player = new BABYLON.Sprite(_data.name + _id, spriteManagerRider);
        player.isPickable = true;
        console.log(_data.position);
        player.position = _data.position;
        player.rotation = _data.rotation;
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