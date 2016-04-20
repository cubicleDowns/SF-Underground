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
    }

    init() {
        window._babylon = this;
        this.engine = new BABYLON.Engine(this.canvas , true);
        var scene = new BABYLON.Scene(this.engine);
        this.scene = scene;
        //Create a light
        var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(100, 100, 0), scene);
        //Create an Arc Rotate Camera - aimed negative z this time
        document.getElementById('loadCover').style.display = "none";
        this.vrCamera = new BABYLON.VRDeviceOrientationFreeCamera("Camera", new BABYLON.Vector3(0, 2, 0), scene, true);
        this.vrCamera.attachControl(this.canvas, true);
        this.activeCamera = this.vrCamera;
        this.nonVRCamera = new BABYLON.VirtualJoysticksCamera("VJC", BABYLON.Vector3.Zero(), scene);
        this.nonVRCamera.attachControl(this.canvas, true);
        this.nonVRCamera.checkCollisions = scene.activeCamera.checkCollisions;
        this.nonVRCamera.applyGravity = scene.activeCamera.applyGravity;
        this.nonVRCamera.parent = this.vrCamera;  
        scene.activeCamera = this.vrCamera;
        this.Data.setUser(null, this.vrCamera.position);

        var spriteManagerPlayer = new BABYLON.SpriteManager("riderManager", this.Data.user.sprite, 1, 128, scene);
        var player = new BABYLON.Sprite("player", spriteManagerPlayer);
        player.isPickable = true;
        player.playAnimation(0, 20, true, 100);
        player.parent = this.vrCamera;
        this.sprites.push(player);
        this.skyBox('s');
        //Creation of a plane
        var plane = BABYLON.Mesh.CreatePlane("plane", 20, scene);
        plane.position.y = -5;
        plane.rotation.x = Math.PI / 2;
        //Creation of a repeated textured material
        var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
        materialPlane.diffuseTexture = new BABYLON.Texture("build/img/textures/grass.jpg", scene);
        materialPlane.diffuseTexture.uScale = 5.0; //Repeat 5 times on the Vertical Axes
        materialPlane.diffuseTexture.vScale = 5.0; //Repeat 5 times on the Horizontal Axes
        materialPlane.backFaceCulling = false; //Always show the front and the back of an element
        plane.material = materialPlane;


        for(let i=0; i < this.Data.users.length; i++){
            this.generateUserSprites(this.Data.users[i], i);
        }

        this.updateFunctionsInLoop.push((function(){
            this.Data.updateUser(this.activeCamera.position, this.activeCamera.rotation);
        }.bind(this)));

        this.gameLoop();

        return scene;

        /*
        window.addEventListener("resize", function() {
            this.engine.resize();
        });
        */

    }

    generateUserSprites(_data, _id){
        var spriteManagerRider = new BABYLON.SpriteManager("riderManager", _data.sprite, 1, 128, scene);
        var player = new BABYLON.Sprite(_data.name + _id, spriteManagerRider);
        player.isPickable = true;
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