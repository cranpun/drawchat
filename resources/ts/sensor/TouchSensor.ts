import { DrawEventHandler } from "../DrawEventHandler";
import { PaperElement } from "../element/PaperElement";
export class TouchSensor {
    private sense: DrawEventHandler;

    public init(sense: DrawEventHandler, paper: PaperElement): void {
        this.sense = sense;
        paper.getCnv().addEventListener("touchstart", (e: TouchEvent) => this.handler(e), {passive: true});
        paper.getCnv().addEventListener("touchleave", (e: TouchEvent) => this.handler(e), {passive: true});
        paper.getCnv().addEventListener("touchmove", (e: TouchEvent) => this.handler(e), {passive: true});
        paper.getCnv().addEventListener("touchend", (e: TouchEvent) => this.handler(e), {passive: true});
    }


    private handler(e: TouchEvent): void {
        e.preventDefault();
        // x,yの取得
        const ct = e.changedTouches[0]
        const bc = (<HTMLCanvasElement>e.target).getBoundingClientRect();
        const x = ct.clientX - bc.left;
        const y = ct.clientY - bc.top;

        if (e.type == "touchend") {
            this.sense.proc("up", "touch", e, x, y);
        } else if (e.type == "touchstart") {
            this.sense.proc("down", "touch", e, x, y);
        } else if (e.type == "touchleave") {
            // 領域の外に出たら終了
            this.sense.proc("up", "touch", e, x, y);
        } else if (e.type === "touchmove") {
            this.sense.proc("move", "touch", e, x, y);
        }
    };
}
