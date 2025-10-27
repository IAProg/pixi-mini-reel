import { Container } from "pixi.js";
import { ReelSymbol } from "./reelSymbol";
import { appConfig } from "../../config";

export class ReelSlot extends Container {
    private _reelOffet: number;
    private _shownindex: number;

    private _symbolSprite: ReelSymbol;
    private _symbolMap: { [key: number]: string; };

    constructor(reelOffet: number) {
        super();
        this._symbolMap = appConfig.mainScene.reelConfig.symbolMap;
        this._reelOffet = reelOffet;
        this._shownindex = reelOffet;
    }

    get offset(): number {
        return this._reelOffet;
    }

    update(position: number, slotIndex: number): void {
        this.y = position;

        if (slotIndex !== this._shownindex) {
            const textureName = this._symbolMap[slotIndex];
            this.removeChild(this._symbolSprite);
            this._symbolSprite = new ReelSymbol(textureName)
            this.addChild(this._symbolSprite);
        }
    }
}
