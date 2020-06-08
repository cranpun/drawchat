import { Sense } from "../Sense";

export class PointerHandler {
    private sense: Sense;

    constructor(sense: Sense) {
        this.sense = sense;
    }

    public init(mycnv: HTMLCanvasElement): void {
        mycnv.addEventListener("pointerup", (e: PointerEvent) => this.handler(e), false);
        mycnv.addEventListener("pointerdown", (e: PointerEvent) => this.handler(e), false);
        mycnv.addEventListener("pointermove", (e: PointerEvent) => this.handler(e), false);
        mycnv.addEventListener("pointerleave", (e: PointerEvent) => this.handler(e), false);
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
