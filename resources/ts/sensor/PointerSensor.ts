import { DrawEventHandler } from "../DrawEventHandler";
import { PaperElement } from "../element/PaperElement";

export class PointerSensor {
    private sense: DrawEventHandler;

    public init(sense: DrawEventHandler, paper: PaperElement): void {
        this.sense = sense;
        paper.getCnv().addEventListener("pointerup", (e: PointerEvent) => this.handler(e), false);
        paper.getCnv().addEventListener("pointerdown", (e: PointerEvent) => this.handler(e), false);
        paper.getCnv().addEventListener("pointermove", (e: PointerEvent) => this.handler(e), false);
        paper.getCnv().addEventListener("pointerleave", (e: PointerEvent) => this.handler(e), false);
    }

    private handler(e: PointerEvent): void {
        // タッチが先に検知されるので優先する。
        e.preventDefault();
        const x: number = e.offsetX;
        const y: number = e.offsetY;

        // 位置の更新
        if (e.type === "pointerup") {
            this.sense.proc("up", e, x, y);
        } else if (e.type === "pointerdown") {
            this.sense.proc("down", e, x, y);
        } else if (e.type === "pointerleave") {
            // 設置したまま外に出た場合は離したとみなす。
            this.sense.proc("up", e, x, y);
        } else if (e.type === "pointermove") {
            this.sense.proc("move", e, x, y);
        }
    }
}
