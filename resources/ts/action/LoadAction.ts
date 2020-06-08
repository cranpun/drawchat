import { Datastore } from "../Datastore";
import * as U from "../u";
import { Paper } from "../Paper";

export class LoadAction {
    private datastore: Datastore;
    private paper: Paper;

    constructor(datastore: Datastore, paper: Paper) {
        this.datastore = datastore;
        this.paper = paper;
    }

    public init() {
        this.proc();
    }

    public async proc(): Promise<void> {
        U.tt("now loading...", true);
        await this.datastore.load();
        await this.paper.redraw(this.datastore.getDesc());
        U.tt("loaded", true);
        setTimeout(() => this.proc(), 7 * 1000);
    }
}
