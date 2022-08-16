import { DrawMine } from "../data/DrawMine";
import * as U from "../u/u";


export class BackElement {
    private ele: HTMLElement;
    private draw: DrawMine;
    constructor() {
        this.ele = document.querySelector("#act-back");
        this.ele.addEventListener("click", () => this.proc());
        this.ele.addEventListener("touchend", () => this.proc());
    }
    public init(draw: DrawMine) {
        this.draw = draw;
    }
    private async proc(): Promise<void> {
        if (!this.draw.isSaved()) {
            if (await U.toast.confirm("保存しますか？", "保存して戻る", "破棄して戻る")) {
                await this.draw.save();
                U.pd("ok");
            } else {
                U.pd("cancel");
            }
        } else {
            U.pd("no content");
        }

        // MYTODO 部屋等の開発後に見直し
        window.location.href = "/";
    }
}
