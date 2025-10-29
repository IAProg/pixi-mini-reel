import { Container, Text } from "pixi.js";
import { ReelSymbol } from "./reelSymbol";
import { appConfig } from "../../config";

export class ReelSlot extends Container {
    private _reelOffet: number;
    private _shownindex: number | undefined;

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
            this.setSymbol( slotIndex );
            this._shownindex = slotIndex;
        }
    }

    setSymbol( symbolId: number ): void {
        this.removeChild(this._symbolSprite);
        this._symbolSprite = new ReelSymbol(this._symbolMap[symbolId])
        this.addChild(this._symbolSprite);
    }

    setLabel( foo ){

        const a = new Text(foo);
        a.x = -200;
        this.addChild(a)


    }
}
