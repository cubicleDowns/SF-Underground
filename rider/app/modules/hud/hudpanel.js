import {HUDObject} from './hudobject';
export class HUDPanel extends HUDObject{

    constructor(name, texture, textureOnPress, hudsystem) {
        super(BABYLON.Mesh.CreatePlane(name, 1, hudsystem.getScene()), hudsystem);
        this.texture = texture;
        var textSize = this.texture.getBaseSize();
        if (textSize.width === 0) {
            textSize = this.texture.getSize();
        }
        this.texture.hasAlpha = false;
        var mat = new BABYLON.StandardMaterial(name + "_material", hudsystem.getScene());
        mat.emissiveColor = BABYLON.Color3.White();
        mat.diffuseTexture = texture;
        mat.opacityTexture = texture;
        mat.backFaceCulling = false;
        this.mesh.material = mat;
        this.mesh.scaling = new BABYLON.Vector3((textSize.width - .1) / hudsystem.zoom, (textSize.height - .1) / hudsystem.zoom, 1);
        this.texturePressed = textureOnPress;
        if (this.texturePressed) {
            this.texturePressed.hasAlpha = true;
        }

        var updateOnPick = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function() {
            if (this.texturePressed) {
                this.mesh.material.diffuseTexture = this.texturePressed;
            }
        }.bind(this));
        var updateOnPointerUp = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function(e) {
            this.mesh.material.diffuseTexture = this.texture;
        }.bind(this));
        this.mesh.actionManager.registerAction(updateOnPick);
        this.mesh.actionManager.registerAction(updateOnPointerUp);
    }

}