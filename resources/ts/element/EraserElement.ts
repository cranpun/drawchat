import { DrawData } from "../data/DrawData";
import { Stroke } from "../u/types";
import * as U from "../u/u";
import { PenAction } from "../action/PenAction";

export class EraserElement {
    private ele: HTMLElement;
    pen: PenAction;

    constructor() {
        this.ele = document.querySelector("#act-eraser");
        this.ele.addEventListener("click", (e: MouseEvent) => this.proc());
        this.ele.addEventListener("touchend", (e: TouchEvent) => this.proc());
    }

    public init(pen: PenAction) {
        this.pen = pen;
    }

    public proc() {
        this.pen.eraser = !this.pen.eraser;
        // 表示を更新
        if (this.pen.eraser) {
            this.ele.classList.replace("is-light", "is-primary");
        } else {
            this.ele.classList.replace("is-primary", "is-light");
        }
    }
}
