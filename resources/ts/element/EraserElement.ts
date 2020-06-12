import { DrawData } from "../data/DrawData";
import { Stroke } from "../u/types";
import * as U from "../u/u";

export class EraserElement {
    private ele: HTMLElement;
    public enable: boolean;

    constructor() {
        this.enable = false;
        this.ele = document.querySelector("#act-eraser");
        this.ele.addEventListener("click", (e: MouseEvent) => this.proc());
        this.ele.addEventListener("touchend", (e: TouchEvent) => this.proc());
    }

    public proc() {
        this.enable = !this.enable;
        // 表示を更新
        if (this.enable) {
            this.ele.classList.replace("is-light", "is-primary");
        } else {
            this.ele.classList.replace("is-primary", "is-light");
        }
    }
}
