import { Container, Text } from "pixi.js";
import { ReelSymbol } from "./reelSymbol";

export class ReelSlot extends Container {
    private _reelOffet: number;

    private _symbolSprite: ReelSymbol;

    constructor(symbolIndex: number, reelOffet: number) {
        super();
        this._reelOffet = reelOffet;
    }

    get offset(): number {
        return this._reelOffet;
    }

    setSymbol(textureName: string) {
        this.removeChild(this._symbolSprite);
        this._symbolSprite = new ReelSymbol(textureName)
        this.addChild(this._symbolSprite);
    }
}
