import { Container, Graphics, Sprite } from "pixi.js";
import gsap from "gsap";
import { IReelConfig } from "../../types";
import { getTexture } from "../../asset-loader";
import { ReelSlot } from "./symbolSlot";

export class Reel extends Container {
    private _config: IReelConfig;

    private _backer: Sprite;
    private _reelY: number;
    private _slots: Array<ReelSlot>;
    private _reelVisualLength: number;

    private _progress: number;

    constructor(config: IReelConfig) {
        super();
        this._config = config;
        const { rowCount, rowPadding, symbolHeight } = this._config;
        const slotsRequired = rowCount + rowPadding;

        this._progress = 0;
        this._reelY = 0;

        this._reelVisualLength = slotsRequired;

        this._backer = new Sprite(getTexture("reelsBacker"));
        this._backer.anchor.set(0.5);

        this._slots = [];
        const slotContainer = new Container();
        for (let slotOffet = 0; slotOffet < slotsRequired; slotOffet++) {
            this._slots.push(new ReelSlot(slotOffet));
        }

        slotContainer.addChild(... this._slots);
        slotContainer.y -= (slotsRequired * symbolHeight * 0.5) + (symbolHeight * 0.5); // move slots back by half reel height (plus half a symbol because they are rooted at their centre)

        const mask = new Graphics()
            .beginFill(0xffffff)
            .drawRect(-this._backer.width / 2, -this._backer.height / 2, this._backer.width, this._backer.height)
            .endFill();
        this.mask = mask;

        this.addChild(this._backer, slotContainer, this.mask);
        this._updateSlots()
    }

    async doSpin(): Promise<void> {
        this._reelY = 0;
        this._progress = 0;
        // move the reel to target index
        gsap.to(this, {
            _progress: 1, duration: 2, ease: "none", onUpdate: () => {
                this._reelY = this._lerp(0, 6 * 4, this._slotEase(this._progress, 0.2));
                this._updateSlots();
            }
        })
    }

    private _updateSlots(): void {
        const { reelBand, symbolHeight } = this._config;
        for (const slot of this._slots) {
            // move slots ahead of the reel head 
            const slotPosition = slot.offset + Math.ceil((this._reelY - slot.offset) / this._reelVisualLength) * this._reelVisualLength;

            // lookup symbol skin
            const slotIndex = Math.floor((slotPosition % reelBand.length));
            const symbolId = reelBand[slotIndex];

            // find the slots relative position to the head and wrap it into reel space
            const slotPositionToHead = ((slotPosition - this._reelY) * -1) % this._reelVisualLength + this._reelVisualLength;

            const slotY = slotPositionToHead * symbolHeight
            slot.update( slotY, symbolId )
        }
    }

    // t goes from 0 → 1
    // combines quadratic tween start with linear mid-end to allow the spin to be done as a single move
    // ease duration to be addusted depending on spin length ( ie to allow time for the anticipation without accelerating too slowly)
    private _slotEase(progress: number, easeDuration: number): number {
        if (progress < easeDuration) {
            return 0.5 * (progress / easeDuration) * (progress / easeDuration);
        } else {
            // Linear section from that point up to 1
            const startY = 0.5;                        // value at the end of ease-in
            const slope = (1 - startY) / (1 - easeDuration); // ensures it reaches 1 at t=1
            return startY + (progress - easeDuration) * slope;
        }
    }


    private _lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }
}
