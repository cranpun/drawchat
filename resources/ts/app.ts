import { DrawEventHandler } from "./DrawEventHandler";
import smoothscroll from "smoothscroll-polyfill";
smoothscroll.polyfill();

require("./bootstrap");

window.addEventListener("load", async () => {
    if (document.querySelector("#drawcanvases")) {
        const sense: DrawEventHandler = new DrawEventHandler();
        sense.init();
    }
    const body: HTMLBodyElement = document.querySelector("body");
    // iosのときのピンチやダブルクリックによる拡大を無効化
    body.addEventListener("touchstart", (e: TouchEvent) => {
        e.preventDefault();
    }, { passive: false });
});