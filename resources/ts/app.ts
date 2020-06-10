import { DrawEventHandler } from "./DrawEventHandler";

require("./bootstrap");

window.addEventListener("load", async () => {
    console.log("loaded");

    if (document.querySelector("#drawcanvases")) {
        const sense: DrawEventHandler = new DrawEventHandler();
        sense.init();
    }
});