import { DrawEventHandler } from "../DrawEventHandler";
import { PaperElement } from "../element/PaperElement";
import { Point } from "../u/types";
import * as U from "../u/u";
import { ZoomScrollAction } from "../action/ZoomScrollAction";
export class TouchSensor {
    private sense: DrawEventHandler;
    private zoomscroll: ZoomScrollAction;

    public init(sense: DrawEventHandler, paper: PaperElement, zoomscroll: ZoomScrollAction): void {
        this.sense = sense;
        this.zoomscroll = zoomscroll;
        paper.getCnv().addEventListener("touchend", (e: TouchEvent) => this.sense.up("touch", e, this.p(e)), { passive: false });
        paper.getCnv().addEventListener("touchstart", (e: TouchEvent) => this.sense.down("touch", e, this.p(e)), { passive: false });
        paper.getCnv().addEventListener("touchmove", (e: TouchEvent) => this.sense.move("touch", e, this.p(e)), { passive: false });
        paper.getCnv().addEventListener("touchleave", (e: TouchEvent) => this.sense.up("touch", e, this.p(e)), { passive: false });

        // moveはscroll等にも使うのでbodyにも登録
        const body: HTMLBodyElement = document.querySelector("body");
        body.addEventListener("touchend", (e: TouchEvent) => this.sense.upbody("touch", e, this.p(e)), { passive: false });
        body.addEventListener("touchstart", (e: TouchEvent) => this.sense.downbody("touch", e, this.p(e)), { passive: false });
        body.addEventListener("touchmove", (e: TouchEvent) => this.sense.movebody("touch", e, this.p(e)), { passive: false });
    }

    private p(e: TouchEvent): Point {
        const ct = e.changedTouches[0]
        const bc = (<HTMLCanvasElement>e.target).getBoundingClientRect();
        const x = ct.clientX - bc.left;
        const y = ct.clientY - bc.top;
        U.tt((<any>e).scale);
        return new Point(x / this.zoomscroll.getZoom(), y / this.zoomscroll.getZoom(), 0);
    }
}
