import { Point, Stroke } from "../data/Draw";
import { Drawing } from "../data/Drawing";

export class UndoElement {
    private ele: HTMLElement;
    private drawing: Drawing;
    public init(drawing: Drawing) {
        this.drawing = drawing;
        this.ele = <HTMLElement>document.querySelector("#act-undo");
        this.ele.addEventListener("click", () => this.proc());
        this.ele.addEventListener("touchend", () => this.proc());
    }

    private async proc(): Promise<void> {
        await this.drawing.undo();
    }
}
