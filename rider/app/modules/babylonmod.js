export class babylonMod {


    constructor(_element, data) {
        this.canvas = document.getElementById('renderCanvas');
        //this.camera = null;
        this.Data = data;
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

        this.createSkyBox();

        
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

        var skybox = BABYLON.Mesh.CreateBox("skyBox", 500.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("build/img/textures/TropicalSunnyDay", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;

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


    createSkyBox(){
        //Material generated using raananw's babylon material editor, https://github.com/raananw/BabylonJS-Material-Editor ;
        var _holoDeck = new BABYLON.StandardMaterial('holo deck', this.scene);
        _holoDeck.alpha = 1;
        _holoDeck.backFaceCulling = false;
        _holoDeck.specularPower = 1;
        _holoDeck.useSpecularOverAlpha = true;
        _holoDeck.useAlphaFromDiffuseTexture = false;

        // diffuse definitions;

        _holoDeck.diffuseColor = new BABYLON.Color3(1.00, 1.00, 1.00);
        //Texture Parameters ;
        //TODO change the filename to fit your needs!;
        var _holoDeck_diffuseTexture = new BABYLON.Texture('build/img/textures/_holoDeck_diffuse.png', this.scene);
        _holoDeck_diffuseTexture.uScale = 5;
        _holoDeck_diffuseTexture.vScale = 5;
        _holoDeck_diffuseTexture.coordinatesMode = 0;
        _holoDeck_diffuseTexture.uOffset = 0;
        _holoDeck_diffuseTexture.vOffset = 0;
        _holoDeck_diffuseTexture.uAng = 0;
        _holoDeck_diffuseTexture.vAng = 0;
        _holoDeck_diffuseTexture.level = 1;
        _holoDeck_diffuseTexture.coordinatesIndex = 0;
        _holoDeck_diffuseTexture.hasAlpha = true;
        _holoDeck_diffuseTexture.getAlphaFromRGB = false;

        _holoDeck.diffuseTexture = _holoDeck_diffuseTexture;

        // emissive definitions;

        _holoDeck.emissiveColor = new BABYLON.Color3(0.00, 0.75, 0.00);

        // ambient definitions;

        _holoDeck.ambientColor = new BABYLON.Color3(0.00, 0.03, 0.04);

        // specular definitions;

        _holoDeck.specularColor = new BABYLON.Color3(0.00, 0.75, 0.00);

        // reflection definitions;

        //Fresnel Parameters ;

        var _holoDeck_reflectionFresnel = new BABYLON.FresnelParameters();
        _holoDeck_reflectionFresnel.isEnabled = true;
        _holoDeck_reflectionFresnel.bias = 0.8;
        _holoDeck_reflectionFresnel.power = 1;
        _holoDeck_reflectionFresnel.leftColor = new BABYLON.Color3(1, 1, 1);
        _holoDeck_reflectionFresnel.rightColor = new BABYLON.Color3(0, 0, 0);
        _holoDeck.reflectionFresnelParameters = _holoDeck_reflectionFresnel;

        var box = BABYLON.Mesh.CreateBox("box", 17.0, this.scene);
        box.material = _holoDeck;

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