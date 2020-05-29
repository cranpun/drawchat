import { Sense } from "./Sense";

require("./bootstrap");

window.addEventListener("load", async () => {
    console.log("loaded");

    const sense: Sense = new Sense();
    sense.init("#drawcanvas", "#bt-save");
    
    const res = await window.axios.get("/api/desc/2");
    console.log(res);
});