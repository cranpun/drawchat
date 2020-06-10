import { DrawData } from "../data/DrawData";
import * as U from "../u/u";

export class SaveAction {
    private datastore: DrawData;

    public init(datastore: DrawData) {
        // const bt_load = document.querySelector("#bt-load");
        // bt_load.addEventListener("click", (e: MouseEvent) => this.load());
        document.querySelector("#bt-save").addEventListener("click", (e: MouseEvent) => this.proc());
        this.datastore = datastore;
    }

    public async proc(): Promise<void> {
        U.tt("now saving...", true);
        await this.datastore.save();
        U.tt("saved", true);
    }
}
