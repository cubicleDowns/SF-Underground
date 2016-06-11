import {HUDObject} from './hudobject';
import {HUDPanel} from './hudpanel';
export class HUDText extends HUDPanel{

    constructor(name, width, height, options, hudsystem) {

    	var dynamicTexture = new BABYLON.DynamicTexture(name, {width:width, height:height}, hudsystem.getScene(), true);
        var ctx            = dynamicTexture.getContext();
        ctx.font           = options.font;
        ctx.textBaseline   = options.textBaseline || "middle";
        ctx.textAlign      = options.textAlign || "start";
        ctx.direction      = options.direction || "inherit";
        ctx.fillStyle      = options.color || "#ffffff";
        var size = dynamicTexture.getSize();
        ctx.fillText(options.text, size.width/2, size.height/2);
        super(name, dynamicTexture, null, hudsystem);
        this._ctx  = ctx;

        dynamicTexture.update();
	}

	update(text) {
        var size = this.texture.getSize();
        this._ctx.clearRect(0, 0, size.width, size.height);
        this._ctx.fillText(text, size.width/2, size.height/2);
        this.texture.update();
     }
}