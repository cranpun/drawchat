import { Sense } from "./Sense";

require('./bootstrap');

window.addEventListener("load", () => {
    console.log("loaded");

    const sense: Sense = new Sense();
    sense.init("#drawcanvas");
});