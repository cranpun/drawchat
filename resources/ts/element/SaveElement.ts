import { DrawingCanvas } from "../data/DrawingCanvas";
import * as U from "../u/u";
import { CanvasElement } from "./CanvasElement";

export class SaveElement {
    private ele: HTMLElement;
    private datastore: DrawingCanvas;
    private paper: CanvasElement;

    public init(datastore: DrawingCanvas, paper: CanvasElement) {
        this.datastore = datastore;
        this.paper = paper;
        this.ele = <HTMLElement>document.querySelector("#act-save");
        this.ele.addEventListener("click", (e: MouseEvent) => this.proc());
        this.ele.addEventListener("touchend", (e: TouchEvent) => this.proc());
    }

    public async proc(): Promise<void> {
        if (this.datastore.getDraw().length() > 0) {
            await this.datastore.save();
            this.datastore.clear();
            this.paper.clear();
            U.toast.normal("saved");
        } else {
            U.toast.normal("not saved (no draw)");
        }
    }
}

