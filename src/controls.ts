
import { Container } from "pixi.js";
import {  ISizeRef } from "./types";
import { appConfig } from "./config";
import { LabelButton } from "./components/labelButton";


/**
 * The main scene, presents the feature demo
 */
export class Controls extends Container {
    private size: ISizeRef;
    
    constructor( spin: Function, anticipate: Function ) {
        super();
        const { size } = appConfig.mainScene;
        this.size = size;

        const btnA = new LabelButton( "SPIN", () => spin() );
        btnA.y -= 150;

        const btnB = new LabelButton( "SPIN\nANTICIPATE", () => anticipate() );
        btnB.y += 150;

        this.addChild(btnA, btnB);

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
            width,
            height * 0.50
        )
    }
}