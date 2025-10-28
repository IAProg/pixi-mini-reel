import { Container, Graphics, Sprite } from "pixi.js";
import gsap from "gsap";
import { IReelConfig } from "../../types";
import { getTexture } from "../../asset-loader";
import { ReelSlot } from "./symbolSlot";
import { quadToLinearLerp } from "./lerp";

export class Reel extends Container {
    private _config: IReelConfig;

    private _bg: Sprite;
    private _slots: Array<ReelSlot>;
    private _slotCount: number;

    private _reelY: number;
    private _progress: number;
    private _inProgress: boolean;

    private _activeReelBand: Array<number>;
    private _activeLanding: Array<number>;

    constructor(config: IReelConfig) {
        super();
        this._config = config;
        const { rowCount, rowPadding, symbolHeight } = this._config;
        this._slotCount = rowCount + rowPadding;

        this._inProgress = false;
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
        // slotContainer.scale.set(0.2)

        const mask = new Graphics()
            .beginFill(0xffffff)
            .drawRect(-this._bg.width / 2, -this._bg.height / 2, this._bg.width, this._bg.height)
            .endFill();
        this.mask = mask;

        this.addChild(this._bg, slotContainer, this.mask);

        this._activeReelBand = [...this._config.reelBand];
        this._activeLanding = [1, 1, 1, 1]; // default landing (leaves)

        this._setCurrentLanding(this._activeLanding);
        this._updateSlots();
    }

    async doSpin(landing: Array<number>, doAnticipation: boolean): Promise<void> {
        if (this._inProgress) {
            this._progress = 1;
            this._inProgress = false;
        }

        this._reelY = this._reelY % this._activeReelBand.length;
        this._progress = 0;

        const spinsNormal = 2;
        const spinsAnticipate = 8;
        const spinDuration = 0.6; 
        const accelerationDuration = 0.3;

        const additionalSpins = doAnticipation ? spinsAnticipate : spinsNormal;

        const landingIndex = this._injectLanding(landing);
        const startPos = this._reelY;
        const reelLength = this._activeReelBand.length;
        const landingPos = landingIndex + reelLength * additionalSpins;
        const totalDistance = landingPos - startPos;

        // duration in seconds
        const duration = (totalDistance / reelLength) * spinDuration;
        const accelerationSpan = accelerationDuration / duration;

        // move the reel to target index
        gsap.to(this, {
            _progress: 1, duration, ease: "none", onUpdate: () => {
                this._reelY = quadToLinearLerp(startPos, landingPos, this._progress, accelerationSpan)
                this._updateSlots();
            }
        });
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
            //const slotY = (slotPosition % this._activeReelBand.length) * symbolHeight;
            const slotY = slotRelativeToHead * symbolHeight;

            slot.update(slotY, symbolId)
        }
    }

    private _injectLanding(landing: Array<number>): number {
        this._activeReelBand = [...this._config.reelBand]; // refresh the reel band
        this._setCurrentLanding(this._activeLanding); // restore the landing position

        const landingPos = (this._reelY + this._slotCount); // todo: place the symbols randomly somewhere in the reel set ??
        let injectPos = landingPos + 1; // we land on the padding symbol
        for (const symbolId of landing) {
            let bandIndex = injectPos % this._activeReelBand.length
            this._activeReelBand[bandIndex] = symbolId;
            injectPos++;
        }

        this._activeLanding = landing;
        return landingPos;
    }

    private _setCurrentLanding(landing: Array<number>): void {
        let injectPos = this._reelY + 1; // we land on the padding symbol;
        for (const symbolId of landing) {
            const reelIndex = Math.floor((injectPos % this._activeReelBand.length));
            this._activeReelBand[reelIndex] = symbolId;
            injectPos++;
        }
        this._activeLanding = landing;
    }




}
