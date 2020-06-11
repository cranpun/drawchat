import { DrawEventHandler } from "./DrawEventHandler";

require("./bootstrap");

window.addEventListener("load", async () => {
    console.log("loaded");

    if (document.querySelector("#drawcanvases")) {
        const sense: DrawEventHandler = new DrawEventHandler();
        sense.init();
    }
    const body: HTMLBodyElement = document.querySelector("body");
    body.addEventListener("touchstart", (e: TouchEvent) => {
        console.log(e);
        // e.preventDefault();
    }, { passive: false });
});