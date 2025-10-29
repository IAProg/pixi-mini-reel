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
        for (let slotOffet = 0; slotOffet > -this._slotCount; slotOffet--) {
            this._slots.push(new ReelSlot(slotOffet));
        }
        slotContainer.addChild(... this._slots);
        slotContainer.y += (this._slotCount * symbolHeight * 0.5) - (symbolHeight * 0.5); // move slots back by half reel height (plus half a symbol because they are rooted at their centre)

        const mask = new Graphics()
            .beginFill(0xffffff)
            .drawRect(-this._bg.width / 2, -this._bg.height / 2, this._bg.width, this._bg.height)
            .endFill();
        this.mask = mask;

        this.addChild(this._bg, slotContainer, this.mask);

        this._activeReelBand = [...this._config.reelBand];

        this._updateSlots();// initilise symbols
        this._setCurrentView( [0,2,2,2,2,0] );
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

        const landingIndex = 1//this._injectLanding(landing);
        const startPos = this._reelY;
        const reelLength = this._activeReelBand.length;
        const landingPos = landingIndex - reelLength * additionalSpins;
        const totalDistance = Math.abs(landingPos - startPos);

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
        const bandLength = this._activeReelBand.length;

        for (const slot of this._slots) {
            // move slots behind of the reel head then wrap negative index to back to positive
            const slotPosition = slot.offset + Math.floor((this._reelY - slot.offset) / this._slotCount) * this._slotCount;
            const slotIndex = ((slotPosition % bandLength) + bandLength) % bandLength; 

            // find the slots relative position to the head and wrap it into reel space
            const slotRelativeToHead = ((slotPosition - this._reelY)) % this._slotCount;
            const slotY = slotRelativeToHead * symbolHeight;

            slot.update(slotY, this._activeReelBand[slotIndex])
        }
    }

    private _setCurrentView(landing: Array<number>): void {
        for (const slot of this._slots) {
            const slotPosition = slot.offset + Math.floor((this._reelY - slot.offset) / this._slotCount) * this._slotCount;
            const slotRelativeToHead = (((slotPosition - this._reelY)) % this._slotCount);
            const convertedIndex = slotRelativeToHead + landing.length - 1;
            slot.setSymbol( landing[convertedIndex] );
        }

        this._updateSlots();// draw default landing
    }
}
