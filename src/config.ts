import { IApplicationOptions } from "pixi.js";
import { IReelConfig, ISizeRef } from "./types";


/**
 * config for components of the application - for modular components strict typing would be enforced here 
 */
export const appConfig = {
    canvas: {
        width: 640,
        height: 640,
        antialias: true,
        autoDensity: true,
        resolution: 2,
        resizeTo: window,
        backgroundColor: 0xffffff
    } as Partial<IApplicationOptions>,
    mainScene: {
        size: { width: 1920, height: 1080 } as ISizeRef,
        reelConfig: {
            rowPadding: 2,
            rowCount: 4,
            symbolWidth: 275,
            symbolHeight: 275,
            reelBand: [
                1,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0, // 24
                1,
                1,
                1
            ],
            symbolMap: {
                0: "blank",
                1: "cash",
                2: "collector"
            }
        } as IReelConfig
    },
    controls: {
        size: { width: 250, height: 1080 } as ISizeRef
    },
    bigWin: {
        textureFlashOn: "bigWin",
        textureFlashOff: "bigWinFlash",
        flashDuration: 0.2,
        flashCount: 5
    },
    anticipation: {
        flashDuration: 0.2,
        flashCount: 5
    }
} 
