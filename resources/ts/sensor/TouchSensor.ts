import { DrawEventHandler } from "../DrawEventHandler";
import { PaperElement } from "../element/PaperElement";
import { Point } from "../u/types";
export class TouchSensor {
    private sense: DrawEventHandler;

    public init(sense: DrawEventHandler, paper: PaperElement): void {
        this.sense = sense;
        paper.getCnv().addEventListener("touchend", (e: TouchEvent) => this.sense.up("touch", e, this.p(e)), { passive: false });
        paper.getCnv().addEventListener("touchstart", (e: TouchEvent) => this.sense.down("touch", e, this.p(e)), { passive: false });
        paper.getCnv().addEventListener("touchmove", (e: TouchEvent) => this.sense.move("touch", e, this.p(e)), { passive: false });
        paper.getCnv().addEventListener("touchleave", (e: TouchEvent) => this.sense.up("touch", e, this.p(e)), { passive: false });

        // moveはscroll等にも使うのでbodyにも登録
        // const body: HTMLBodyElement = document.querySelector("body");
        // body.addEventListener("touchmove", (e: TouchEvent) => this.movebody(e, this.p(e)), false);
    }

    private p(e: TouchEvent): Point {
        const ct = e.changedTouches[0]
        const bc = (<HTMLCanvasElement>e.target).getBoundingClientRect();
        const x = ct.clientX - bc.left;
        const y = ct.clientY - bc.top;
        return new Point(x, y, 0);
    }
}
