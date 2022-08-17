import { LoadAction } from "../action/LoadAction";
import * as U from "../u/u";

export class LoadElement {
    private ele: HTMLElement;
    private load: LoadAction;

    public init(load: LoadAction) {
        this.load = load;
        this.ele = <HTMLElement>document.querySelector("#act-load-other-force");
        this.ele.addEventListener("click", (e: MouseEvent) => this.proc());
        this.ele.addEventListener("touchend", (e: TouchEvent) => this.proc());
    }

    public async proc(): Promise<void> {
        U.toast.normal("now loading");
        await this.load.proc(false);
        U.toast.normal("loaded");
    }
}
