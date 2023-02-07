import { Drawing } from "../data/Drawing";
import * as U from "../u/u";


export class BackElement {
    private ele: HTMLElement;
    private draw: Drawing;
    constructor() {
        this.ele = <HTMLElement>document.querySelector("#act-back");
        this.ele.addEventListener("click", () => this.proc());
        this.ele.addEventListener("touchend", () => this.proc());
    }
    public init(draw: Drawing) {
        this.draw = draw;
    }
    private async proc(): Promise<void> {
        if (!this.draw.isSaved()) {
            U.toast.normal("保存して戻ります")
            await this.draw.save();
        }

        window.location.href = "/";
    }
}
