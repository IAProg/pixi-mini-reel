import { Sprite } from "pixi.js";
import { getTexture } from "../asset-loader";
import { appConfig } from "../config";

export class Anticipation extends Sprite {   

    constructor() {
        super( getTexture("anticipation") );
        this.anchor.set(0.5);

        this.visible = false;
    }

    public addAnticipation( tl: gsap.core.Timeline, triggerTime: number ): number {
        const { flashCount, flashDuration } = appConfig.bigWin;

        tl.add(() => { this.visible = true; }, triggerTime);
        for ( let i = 0; i < flashCount; i++ ) {
            tl.add(() => { this.visible = true }, triggerTime);
            triggerTime += flashDuration;
            tl.add(() => { this.visible = false }, triggerTime);
            triggerTime += flashDuration;
        }  
        tl.add(() => { this.visible = false; }, triggerTime);        

        return triggerTime;
    }

}
