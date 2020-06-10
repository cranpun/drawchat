import { DrawEventHandler } from "./DrawEventHandler";
import { ScrollAction } from "./action/ScrollAction";
import { ZoomAction } from "./action/ZoomAction";

require("./bootstrap");

window.addEventListener("load", async () => {
    console.log("loaded");

    if (document.querySelector("#drawcanvases")) {
        const sense: DrawEventHandler = new DrawEventHandler();
        sense.init();
    }
});