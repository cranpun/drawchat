import { DrawingCanvas } from "../data/DrawingCanvas";
import * as U from "../u/u";


export class BackElement {
    private ele: HTMLElement;
    private draw: DrawingCanvas;
    constructor() {
        this.ele = <HTMLElement>document.querySelector("#act-back");
        this.ele.addEventListener("click", () => this.proc());
        this.ele.addEventListener("touchend", () => this.proc());
    }
    public init(draw: DrawingCanvas) {
        this.draw = draw;
    }
    private async proc(): Promise<void> {
        U.toast.normal("保存して戻ります")
        await this.draw.save();
        window.location.href = "/";
    }
}
