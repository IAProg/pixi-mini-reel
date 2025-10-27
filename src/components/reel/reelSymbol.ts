import { Point, Sprite, Text } from "pixi.js";
import { getTexture } from "../../asset-loader";

export class ReelSymbol extends Sprite {   

    constructor( textureName: string) {
        super();

        this.anchor.set(0.5);
        this.texture = getTexture( textureName );
    }
}
