import { PenAction } from "../action/PenAction";

export class EraserElement {
    private ele: HTMLElement;
    private pen: PenAction;

    constructor() {
        this.ele = document.querySelector("#act-eraser");
        this.ele.addEventListener("click", (e: MouseEvent) => this.proc());
        this.ele.addEventListener("touchend", (e: TouchEvent) => this.proc());
    }

    public init(pen: PenAction) {
        this.pen = pen;
    }

    public proc() {
        this.pen.opt.eraser = !this.pen.opt.eraser;
        const enable = "has-background-primary";
        const disable = "has-background-light";
        // 表示を更新
        if (this.pen.opt.eraser) {
            this.ele.classList.replace(disable, enable);
        } else {
            this.ele.classList.replace(enable, disable);
        }
    }
}
