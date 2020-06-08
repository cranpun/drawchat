import { Sense } from "../Sense";

export class MouseHandler {
    private sense: Sense;

    constructor(sense: Sense) {
        this.sense = sense;
    }

    public init(mycnv: HTMLCanvasElement): void {
        mycnv.addEventListener("mouseup", (e: MouseEvent) => this.handler(e), false);
        mycnv.addEventListener("mousedown", (e: MouseEvent) => this.handler(e), false);
        mycnv.addEventListener("mousemove", (e: MouseEvent) => this.handler(e), false);
        mycnv.addEventListener("mouseleave", (e: MouseEvent) => this.handler(e), false);
    }

    private handler(e: MouseEvent): void {
        // タッチが先に検知されるので優先する。
        e.preventDefault();
        const x: number = e.offsetX;
        const y: number = e.offsetY;

        // 位置の更新
        if (e.type === "mouseup") {
            this.sense.proc("up", e, x, y);
        } else if (e.type === "mousedown") {
            this.sense.proc("down", e, x, y);
        } else if (e.type === "mouseleave") {
            // 設置したまま外に出た場合は離したとみなす。
            this.sense.proc("up", e, x, y);
        } else if (e.type === "mousemove") {
            this.sense.proc("move", e, x, y);
        }
    };
}
