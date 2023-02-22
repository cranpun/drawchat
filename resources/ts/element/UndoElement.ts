import { Point, Stroke } from "../data/Draw";
import { DrawingCanvas } from "../data/DrawingCanvas";

export class UndoElement {
    private ele: HTMLElement;
    private drawing: DrawingCanvas;
    public init(drawing: DrawingCanvas) {
        this.drawing = drawing;
        this.ele = <HTMLElement>document.querySelector("#act-undo");
        this.ele.addEventListener("click", () => this.proc());
        this.ele.addEventListener("touchend", () => this.proc());
    }

    private async proc(): Promise<void> {
        await this.drawing.undo();
    }
}
