
import { Container } from "pixi.js";
import { IBonusData, ISizeRef } from "./types";
import { appConfig } from "./config";
import gsap from "gsap";
import { Reel } from "./components/reel/reel";

/**
 * The main scene, presents the feature demo
 */
export class MainScene extends Container {
    private size: ISizeRef;

    private _reels: Reel;

    private _tl: gsap.core.Timeline;

    constructor() {
        super();
        const { size, reelConfig } = appConfig.mainScene;
        this.size = size;

        this._reels = new Reel(reelConfig);

        this.addChild( this._reels );

        this._tl = gsap.timeline();
    }

    public async playBonus(bonusRound: Array<IBonusData>): Promise<void> {

        this._reels.doSpin( [2,2,2,2] );

        return;

   //   this._tl.progress(1);

   //   return new Promise((resolve) => {
   //       this._tl = gsap.timeline({ onComplete: resolve });

   //       let triggerTime = 0;
   //       let roundIndex = 0;

   //       for ( const roundData of bonusRound ){
   //           triggerTime = this._cascadeReel.addCascade( this._tl, roundData.landing, triggerTime, roundData.showAnticipation );
   //           roundIndex++;
   //       }
   //   });
    }

    /**
     * resize handler.
     * scales to fit the main stage
     * @param width - width of the stage
     * @param height - width of the stage
     */
    public resize(width: number, height: number): void {
        this.scale.set(Math.min(
            width / this.size.width,
            height / this.size.height
        ));


        this.position.set(
            width * 0.50,
            height * 0.50
        )
    }
}