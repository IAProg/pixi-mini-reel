import { Container, Renderer, Text, Ticker} from "pixi.js";
import { appConfig } from "./config";
import { Background } from "./components/background";
import { MainScene } from "./main-scene";
import gsap from "gsap";
import { Controls } from "./controls";
import { getDummyBonus } from "./dummyBonus";



/**
 * The core of the application. 
 * The application is responsible for managing sub components and conducting high level logic flow
 */
export class App {
    private _renderer: Renderer;
    private _stage: Container;

    private _bg: Background;
    private _mainScene: MainScene;
    private _controls: Controls;

    private _elapsed: number = 0;

    constructor(){
        // create rendering context
        this._stage = new Container();
        this._renderer = new Renderer(appConfig.canvas);
        document.body.appendChild(this._renderer.view);

        // enable pixi inspector
        globalThis.__PIXI_STAGE__ = this._stage;
        globalThis.__PIXI_RENDERER__ = this._renderer;
        
        // create elements
        this._bg = new Background();
        this._mainScene = new MainScene();
        this._controls = new Controls( this.play.bind(this) );
        this._stage.addChild(this._bg, this._mainScene, this._controls);

        // scale content to fit window
        this.scaleContent(window.innerWidth, window.innerHeight);
        window.addEventListener("resize", () => 
            this.scaleContent(window.innerWidth, window.innerHeight)
        );   

        // we need to update gsap manually 
        gsap.ticker.remove(gsap.updateRoot);

        // start
        const ticker = new Ticker();
        ticker.add((dt) => {
            this._elapsed += dt / 100;
            gsap.updateRoot(this._elapsed);
            this._renderer.render(this._stage);
        });
        ticker.start();
    }

    private jumpElapsed( secondsToSkip: number ): void{
        this._elapsed += secondsToSkip;
    }

    private play(): void{
        this._mainScene.playBonus( getDummyBonus() );
    }
    
    /**
     * call resize handler on components 
    */
   private scaleContent(width: number, height: number): void{
        this._renderer.resize(width, height);
        this._bg.resize(width, height);
        this._mainScene.resize(width, height);
        this._controls.resize(width, height);
    }
}
