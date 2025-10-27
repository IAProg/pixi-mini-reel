import { Container, Text } from "pixi.js";
import { ReelSymbol } from "./reelSymbol";

export class ReelSlot extends Container {
    private _symbolIndex: number;
    private _reelPosition: number;

    private _symbolSprite: ReelSymbol;
    private _slotLabel: Text;
    private _indexLabel: Text;

    constructor(symbolIndex: number, reelPosition: number) {
        super();
        this._symbolIndex = symbolIndex;
        this._reelPosition = reelPosition;

        this._indexLabel = new Text("undef", { fontSize: 80 });
        this._indexLabel.x = +120;
        this._indexLabel.y = -120;

        this._slotLabel = new Text(symbolIndex, { fontSize: 80 });
        this._slotLabel.x = -180;
        this._slotLabel.y = -120;
        this.addChild(this._slotLabel, this._indexLabel);
    }

    get reelPos(): number {
        return this._reelPosition;
    }

    setSymbol(textureName: string) {
        this.removeChild(this._symbolSprite);
        this._symbolSprite = new ReelSymbol(textureName)
        this.addChild(this._symbolSprite);
    }

    labelIndex( indexValue ): void {
        this._indexLabel.text = indexValue;
    }
}
