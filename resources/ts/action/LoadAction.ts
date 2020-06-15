import { DrawData } from "../data/DrawData";
import * as U from "../u/u";
import { PaperElement } from "../element/PaperElement";
import { RedrawAction } from "./RedrawAction";
import { PenAction } from "./PenAction";

export class LoadAction {
    private paper: PaperElement;
    private datastore: DrawData;
    private redraw: RedrawAction;
    private pen: PenAction;
    public init(paper: PaperElement, datastore: DrawData, redraw: RedrawAction, pen: PenAction) {
        this.paper = paper;
        this.datastore = datastore;
        this.redraw = redraw;
        this.pen = pen;
        this.proc();
    }
    public async proc(): Promise<void> {
        await this.datastore.load();
        await this.redraw.proc(this.paper, this.datastore, this.pen);
        console.log("loaded!!");
        setTimeout(() => this.proc(), 7 * 1000);
    }
}
