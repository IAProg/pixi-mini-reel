import { Container, Graphics, Point, Sprite } from "pixi.js";
import { ICascadeConfig } from "../../types";
import { ReelSystem } from "./symbol";
import { getTexture } from "../../asset-loader";

export class CascadeReel extends Container {
    private _symbols: Array<ReelSystem>;
    private _backer: Sprite;
    private _config: ICascadeConfig;

    constructor(config: ICascadeConfig) {
        super();
        this._config = config;
        const { colCount, rowCount, symbolWidth, symbolHeight } = this._config;

        this._symbols = [];

        this._backer = new Sprite(getTexture("reelsBacker"));
        this._backer.anchor.set(0.5);

        let symbolIndex = 0;
        const symbolContainer = new Container();
        for (let col = 0; col < colCount; col++) {
            for (let row = 0; row < rowCount; row++) {
                const homePos = new Point(
                    (symbolWidth * 0.5) + (symbolWidth * col),
                    (symbolHeight * 0.5) + (symbolHeight * row)
                );
                const symbol = new ReelSystem("blank", symbolIndex, homePos);

                this._symbols.push(symbol);
                symbolIndex++;
            }
        }

        symbolContainer.addChild(... this._symbols);
        symbolContainer.x -= symbolContainer.width / 2;
        symbolContainer.y -= symbolContainer.height / 2;

        const mask = new Graphics()
            .beginFill(0xffffff)
            .drawRect(0, 0, this._backer.width, this._backer.height)
            .endFill();
        symbolContainer.addChild(mask);
        symbolContainer.mask = mask;

        this.addChild(this._backer, symbolContainer);
    }

    public addCascade(tl: gsap.core.Timeline, landing: Array<number>, triggerTime: number, showAnticipation: boolean): number {
        triggerTime = this._addCascade(tl, this._symbols, "out", triggerTime);
        triggerTime = this._addSkinChange(tl, this._symbols, landing, triggerTime);
        triggerTime = this._addCascade(tl, this._symbols, "in", triggerTime, showAnticipation);

        return triggerTime;
    }

    private _addCascade(tl: gsap.core.Timeline, symbols: Array<ReelSystem>, mode: "in" | "out", triggerTime: number, showAnticipation: boolean = false): number {
        const { dropTime, dropStagger, yOut, yIn, cascadeGroups, anticipationTriggerIndex } = this._config;

        let groupIndex = 0;
        for (const cascadeGroup of cascadeGroups) {
            for (const symbolIndex of cascadeGroup) {
                const targetSymbol = symbols[symbolIndex];

                const homeY = targetSymbol.homePos.y;
                const outY = mode === "out" ? (homeY + yOut) : (homeY + yIn);

                const start = mode === "out" ? homeY : outY;
                const end = mode === "out" ? outY : homeY;
                const ease = mode === "out" ? "power2.in" : "power2.out";

                tl.fromTo(targetSymbol, { y: start }, { y: end, ease, duration: dropTime, immediateRender: false }, triggerTime);
                triggerTime += dropStagger;
            }
            groupIndex++;
        }
        triggerTime += dropTime;
        return triggerTime;
    }

    private _addSkinChange(tl: gsap.core.Timeline, symbols: Array<ReelSystem>, landing: Array<number>, triggerTime: number): number {
        for (let i = symbols.length - 1; i >= 0; i--) {
            const targetSymbol = this._symbols[i];
            const symbolID = landing[i];
            const symbolSkin = this._config.symbolMap[symbolID];
            tl.add(() => { targetSymbol.texture = getTexture(symbolSkin); }, triggerTime);
        }
        return triggerTime;
    }
}
