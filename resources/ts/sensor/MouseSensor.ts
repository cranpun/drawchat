import { DrawEventHandler } from "../DrawEventHandler";
import { PaperElement } from "../element/PaperElement";

export class MouseSensor {
    private sense: DrawEventHandler;

    public init(sense: DrawEventHandler, paper: PaperElement): void {
        this.sense = sense;
        paper.getCnv().addEventListener("mouseup", (e: MouseEvent) => this.handler(e), false);
        paper.getCnv().addEventListener("mousedown", (e: MouseEvent) => this.handler(e), false);
        paper.getCnv().addEventListener("mousemove", (e: MouseEvent) => this.handler(e), false);
        paper.getCnv().addEventListener("mouseleave", (e: MouseEvent) => this.handler(e), false);
    }

    private handler(e: MouseEvent): void {
        // タッチが先に検知されるので優先する。
        e.preventDefault();
        const x: number = e.offsetX;
        const y: number = e.offsetY;

        // 位置の更新
        if (e.type === "mouseup") {
            //this.sense.proc("up", "mouse", e, x, y);
        } else if (e.type === "mousedown") {
            this.sense.proc("down", "mouse", e, x, y);
        } else if (e.type === "mouseleave") {
            // 設置したまま外に出た場合は離したとみなす。
            this.sense.proc("up", "mouse", e, x, y);
        } else if (e.type === "mousemove") {
            this.sense.proc("move", "mouse", e, x, y);
        }
    };
}
