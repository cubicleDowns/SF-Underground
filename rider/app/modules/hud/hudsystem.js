import {HUDObject} from './hudobject';
export class HUDSystem {

    constructor(scene, guiWidth, guiHeight) {
        this._scene = scene;
        var mainCam = scene.activeCamera;
        if (this._scene.activeCameras.indexOf(mainCam) == -1) {
            this._scene.activeCameras.push(mainCam);
        }
        this.dpr = window.devicePixelRatio;
        if (typeof guiWidth === "undefined") {
            guiWidth = scene.getEngine().getRenderWidth();
        }
        if (typeof guiHeight === "undefined") {
            guiHeight = scene.getEngine().getRenderHeight();
        }
        this.zoom = Math.max(guiWidth, guiHeight) / Math.max(scene.getEngine().getRenderingCanvas().width, scene.getEngine().getRenderingCanvas().height);
        this._camera = null;
        this._initCamera();
        this._scene.activeCamera = mainCam;
        this._scene.cameraToUseForPointers = mainCam;
        this.objects = [];
        this.groups = [];
        this.visible = true;
        this._objectUnderPointer = null;
        this.LAYER_MASK = 8;
        this.GAME_LAYER_MASK = 1;
    }

    getScene() {
        return this._scene;
    }

    getCamera() {
        return this._camera;
    }

    _initCamera() {
        this._camera = new BABYLON.FreeCamera("GUICAMERA", new BABYLON.Vector3(0, 0, -30), this._scene);
        this._camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        this._camera.setTarget(BABYLON.Vector3.Zero());
        this._camera.layerMask = this.LAYER_MASK;
        this.resize();
        this._scene.activeCameras.push(this._camera);
    }

    resize() {
        var width = this.dpr * this._scene.getEngine().getRenderingCanvas().width;
        var height = this.dpr * this._scene.getEngine().getRenderingCanvas().height;
        var right = width / this.dpr;
        var top = height / this.dpr;
        this._camera.orthoTop = top / 2;
        this._camera.orthoRight = right / 2;
        this._camera.orthoBottom = -top / 2;
        this._camera.orthoLeft = -right / 2;
        this.guiWidth = right;
        this.guiHeight = top;
    }

    dispose() {
        this.objects.forEach(function(p) {
            p.dispose();
        })
        this.objects = [];
        this.groups.forEach(function(g) {
            g.dispose();
        })

        this.groups = [];
        this._camera.dispose();
    }

    add(mesh) {
        var p = new HUDObject(mesh, this);
        this.objects.push(p);
        return p;
    }

    setVisible(bool) {
        this.visible = bool;
        this.objects.forEach(function(p) {
            p.setVisible(bool);
        });
    }
    isVisible() {
        return this.visible;
    }

    getObjectByName(name) {
        for (var o = 0; o < this.objects.length; o++) {
            if (this.objects[o].mesh.name === name) {
                return this.objects[o];
            }
        }
        return null;
    };
    getGroupByName(name) {
        for (var o = 0; o < this.groups.length; o++) {
            if (this.groups[o].name === name) {
                return this.groups[o];
            }
        }
        return null;
    }

    updateCamera(cam) {
        console.log(cam);
        var myCam = cam || this._scene.activeCamera;
        myCam.layerMask = this.GAME_LAYER_MASK;
        for (var m = 0; m < this._scene.meshes.length; m++) {
            var mesh = this._scene.meshes[m];
            if (!mesh.__gui) {
                if (mesh.layerMask) {
                    mesh.layerMask = this.GAME_LAYER_MASK;
                }
            }
        }
    }


}