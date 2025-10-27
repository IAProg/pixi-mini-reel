import { Container, Graphics, Sprite, Text, Texture, Ticker } from "pixi.js";
import gsap from "gsap";
import { IReelConfig } from "../../types";
import { getTexture } from "../../asset-loader";
import { ReelSlot } from "./symbolSlot";

export class Reel extends Container {
    private _backer: Sprite;
    private _config: IReelConfig;

    private _reelState: "Starting" | "Spinning" | "Landing" | "Idle";

    private _reelSpeedCurrent: number;
    private _reelSpeedMax: number;

    private _reelY: number;
    private _slots: Array<ReelSlot>;
    private _reelVisualLength: number;
    private _reelSetLength: number;

    constructor(config: IReelConfig) {
        super();
        this._config = config;
        const { rowCount, rowPadding, symbolHeight, reelBand } = this._config;
        const slotsRequired = rowCount + rowPadding;

        this._reelY = 0;
        this._reelSpeedCurrent = 0;
        this._reelSpeedMax = 10;

        this._reelVisualLength = slotsRequired;
        this._reelSetLength = reelBand.length;

        this._slots = [];
        let symbolIndex = 0;
        const slotContainer = new Container();
        for (let slotOffet = 0; slotOffet < slotsRequired; slotOffet++) {
            const slot = new ReelSlot(symbolIndex, slotOffet);
            slot.setSymbol("blank");
            this._slots.push(slot);
            symbolIndex++;
        }

        slotContainer.addChild(... this._slots);
        slotContainer.y -= this._reelVisualLength * symbolHeight / 2;
        this._backer = new Sprite(getTexture("reelsBacker"));
        this._backer.anchor.set(0.5);


        const mask = new Graphics()
            .beginFill(0xffffff)
            .drawRect(-this._backer.width / 2, -this._backer.height / 2, this._backer.width, this._backer.height)
            .endFill();
        this.mask = mask;

        this.addChild(this._backer, slotContainer, mask);

        this._reelState = "Idle"

        const ticker = new Ticker();
        ticker.add(this._update, this);
        ticker.start();

        this._updateSlots()
    }

    async startSpin(): Promise<void> {
        const speedUpTime = 0.5; // use drop time and speed here

        this._reelY = 0;
        this._reelSpeedCurrent = 0;
        this._reelState = "Starting";
        gsap.to(this, { _reelSpeedCurrent: this._reelSpeedMax, duration: speedUpTime, ease: "power2.in", onComplete: () => { this._reelState = "Spinning"; } });

    }

    private _updateSlots(): void {
        const { reelBand, symbolHeight, symbolMap } = this._config;

        for (const slot of this._slots) {
            const slotPosition = slot.offset + Math.ceil((this._reelY -  slot.offset) / this._reelVisualLength) * this._reelVisualLength;

            const slotIndex = Math.floor((slotPosition % this._reelSetLength));
            const symbolId = reelBand[slotIndex];
            const symbolSkin = symbolMap[symbolId];

            const slotPositionToHead = ((slotPosition - this._reelY) * -1) % this._reelVisualLength + this._reelVisualLength; // find the slots relative position to the head and wrap it into reel space

            slot.y = slotPositionToHead * symbolHeight;
            slot.setSymbol(symbolSkin);
        }
    }

    private _update(dt: number): void {
        if (this._reelState === "Idle") return;


        this._reelY += (this._reelSpeedCurrent * dt);



        this._updateSlots()
    }
}
