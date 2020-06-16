import { DrawMine } from "../data/DrawMine";
import * as U from "../u/u";

export class SaveElement {
    private ele: HTMLElement;
    private datastore: DrawMine;

    public init(datastore: DrawMine) {
        this.datastore = datastore;
        this.ele = document.querySelector("#act-save");
        this.ele.addEventListener("click", (e: MouseEvent) => this.proc());
        this.ele.addEventListener("touchend", (e: TouchEvent) => this.proc());
    }

    public async proc(): Promise<void> {
        await this.datastore.save();
        U.toast.normal("saved");
    }
}
