import { Container, Graphics, Sprite } from "pixi.js";
import gsap from "gsap";
import { IReelConfig } from "../../types";
import { getTexture } from "../../asset-loader";
import { ReelSlot } from "./symbolSlot";
import { randomInt } from "../../utils";

export class Reel extends Container {
    private _config: IReelConfig;

    private _bg: Sprite;
    private _slots: Array<ReelSlot>;
    private _slotCount: number;

    private _reelY: number;
    private _progress: number;
    private _activeReelBand: Array<number>;

    constructor(config: IReelConfig) {
        super();
        this._config = config;
        const { rowCount, rowPadding, symbolHeight } = this._config;
        this._slotCount = rowCount + rowPadding;

        this._progress = 0;
        this._reelY = 0;

        this._bg = new Sprite(getTexture("reelsBacker"));
        this._bg.anchor.set(0.5);

        this._slots = [];
        const slotContainer = new Container();
        for (let slotOffet = 0; slotOffet < this._slotCount; slotOffet++) {
            this._slots.push(new ReelSlot(slotOffet));
        }
        slotContainer.addChild(... this._slots);
        slotContainer.y -= (this._slotCount * symbolHeight * 0.5) + (symbolHeight * 0.5); // move slots back by half reel height (plus half a symbol because they are rooted at their centre)

        const mask = new Graphics()
            .beginFill(0xffffff)
            .drawRect(-this._bg.width / 2, -this._bg.height / 2, this._bg.width, this._bg.height)
            .endFill();
        this.mask = mask;

        this.addChild(this._bg, slotContainer, this.mask);

        this._activeReelBand = [...this._config.reelBand];
        this._updateSlots()
    }

    async doSpin(landing: Array<number>): Promise<void> {
        this._reelY = 0;
        this._progress = 0;

        const landingIndex = this._injectLanding(landing);
        const landingPos = landingIndex + (this._activeReelBand.length * randomInt(2, 3));

        const spinCount = (landingPos - this._reelY) / this._slotCount;

        const spinDuration = 0.33 * spinCount;

        console.log(spinCount)

        // a portion of the first spin is spent accelerating 
        // we need to calculate what protion of the TOTAL spin tween should be spent under acceleration, the more spins the lower this value should be

        const accelerationPortion = 0.33;

        // move the reel to target index
        gsap.to(this, {
            _progress: 1, duration: spinDuration, ease: "none", onUpdate: () => {
                this._reelY = this._quadToLinearLerp(0, landingPos, this._progress, 0.5);
                this._updateSlots();
            }
        })
    }

    private _updateSlots(): void {
        const { symbolHeight } = this._config;
        for (const slot of this._slots) {
            // move slots ahead of the reel head 
            const slotPosition = slot.offset + Math.ceil((this._reelY - slot.offset) / this._slotCount) * this._slotCount;

            // lookup symbol skin
            const slotIndex = Math.floor((slotPosition % this._activeReelBand.length));
            const symbolId = this._activeReelBand[slotIndex];

            // find the slots relative position to the head and wrap it into reel space
            const slotRelativeToHead = ((slotPosition - this._reelY) * -1) % this._slotCount + this._slotCount;
            const slotY = slotRelativeToHead * symbolHeight;

            slot.update(slotY, symbolId)
        }
    }

    private _injectLanding(landing: Array<number>): number {
        this._activeReelBand = [...this._config.reelBand];

        const landingPos = (this._reelY + this._slotCount) % this._activeReelBand.length; // todo: place the symbols randomly somewhere in the reel set
        let injectPos = landingPos + 1; // we land on the padding symbol

        for (const symbolId of landing) {
            this._activeReelBand[injectPos] = symbolId;
            injectPos++;
        }

        return landingPos;
    }


    private _quadToLinearLerp(a: number, b: number, t: number, tC: number): number {
        const dist = b - a;
        const accel = (2 * dist) / (tC * (2 - tC)); // constant acceleration

        if (t < tC) { // accelerating phase
            return a + 0.5 * accel * t * t;
        } else { // constant-speed phase
            const vC = accel * tC;
            const xC = 0.5 * accel * tC * tC;
            return a + xC + vC * (t - tC);
        }
    }

}
