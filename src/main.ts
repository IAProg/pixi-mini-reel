import { App } from "./application";
import { loadAssets } from "./asset-loader";

// simple bootstrap load assets -> start app 
// pixiapp is registered for pixi inspector
loadAssets().then(() => 
    new App()
);


