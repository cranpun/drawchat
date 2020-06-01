import { Sense } from "./Sense";

require("./bootstrap");

window.addEventListener("load", async () => {
    console.log("loaded");

    if (document.querySelector("#drawcanvases")) {
        const sense: Sense = new Sense();
        sense.init(
            <HTMLCanvasElement>document.querySelector("#mycanvas"),
            <HTMLCanvasElement>document.querySelector("#othercanvas")
        );
    }
});