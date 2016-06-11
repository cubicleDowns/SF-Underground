export class HUDObject {

    constructor(mesh, hudsystem) {
        this.mesh = mesh;
        this.mesh.__gui = true;
        this.hudsystem = hudsystem;
        this.onClick = null;
        this.onHoverOn = null;
        this.onHoverOut = null;
  
        this.mesh.actionManager = new BABYLON.ActionManager(mesh._scene);

        var updateOnPointerUp = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function(e) {
            if (this.onClick) {
                this.onClick(e);
            }
        }.bind(this));
        var updateOnHoverOn = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(e) {
            if (this.onHoverOn) {
                this.onHoverOn(e);
            }
        }.bind(this));
        var updateOnHoverOut = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(e) {
            if (this.onHoverOut) {
                this.onHoverOut(e);
            }
        }.bind(this));
        this.mesh.actionManager.registerAction(updateOnPointerUp);
        this.mesh.actionManager.registerAction(updateOnHoverOn);
        this.mesh.actionManager.registerAction(updateOnHoverOut);
        this.mesh.layerMask = hudsystem.LAYER_MASK;
        this.hudsystem.objects.push(this);
        this.guiposition(BABYLON.Vector3.Zero());
    }


    guiposition(gp) {
        this.guiPosition = gp;
        this.mesh.position = new BABYLON.Vector3(gp.x / this.hudsystem.zoom - this.hudsystem.guiWidth / 2, this.hudsystem.guiHeight / 2 - gp.y / this.hudsystem.zoom, gp.z);
    }

    relativePosition(pos) {
        if (pos) {
            this.mesh.position.x = this.hudsystem.guiWidth * pos.x - this.hudsystem.guiWidth / 2;
            this.mesh.position.y = this.hudsystem.guiHeight * (1 - pos.y) - this.hudsystem.guiHeight / 2;
            this.mesh.position.z = pos.z;
        } else {
            return new BABYLON.Vector3((this.mesh.position.x + this.hudsystem.guiWidth / 2) / this.hudsystem.guiWidth, (this.hudsystem.guiHeight / 2 - this.mesh.position.y) / this.hudsystem.guiHeight, this.mesh.position.z);
        }
    }

    position(pos) {
        if (pos) {
            this.mesh.position = pos;
            this.guiPosition = new BABYLON.Vector3(this.hudsystem.guiWidth / 2 + pos.x, this.hudsystem.guiHeight / 2 + pos.y, pos.z);
        } else {
            return this.mesh.position;
        }
    }

    scaling(scale) {
        if (scale) {
            this.mesh.scaling = scale;
        } else {
            return this.mesh.scaling;
        }
    }

    dispose() {
        this.mesh.dispose();
    }

    setVisible(bool) {
        this.mesh.isVisible = bool;
    }

    flip(duration) {
        var end = this.mesh.rotation.y + Math.PI * 2;
        if (typeof duration === "undefined") {
            duration = 1e3;
        }
        BABYLON.Animation.CreateAndStartAnimation("flip", this.mesh, "rotation.y", 30, 30 * duration * .001, this.mesh.rotation.y, end, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    }

    fadeout(duration) {
        if (typeof duration === "undefined") {
            duration = 1e3;
        }
        BABYLON.Animation.CreateAndStartAnimation("fadeout", this.mesh, "visibility", 30, 30 * duration * .001, 1, 0, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    }

    fadein(duration) {
        if (typeof duration === "undefined") {
            duration = 1e3;
        }
        BABYLON.Animation.CreateAndStartAnimation("fadein", this.mesh, "visibility", 30, 30 * duration * .001, 0, 1, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    }



}