import { Datastore } from "../Datastore";
import * as U from "../u";
import { Paper } from "../Paper";
import { RedrawAction } from "./RedrawAction";
import { PenAction } from "./PenAction";

export class LoadAction {
    private paper: Paper;
    private datastore: Datastore;
    private redraw: RedrawAction;
    private pen: PenAction;
    public init(paper: Paper, datastore: Datastore, redraw: RedrawAction, pen: PenAction) {
        this.paper = paper;
        this.datastore = datastore;
        this.redraw = redraw;
        this.pen = pen;
    }
    public async proc(): Promise<void> {
        U.tt("now loading...", true);
        await this.datastore.load();
        this.redraw.proc(this.paper, this.datastore, this.pen);
        U.tt("loaded", true);
        setTimeout(() => this.proc(), 7 * 1000);
    }
}
