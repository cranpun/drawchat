import { DrawEventHandler } from "../DrawEventHandler";
import { PaperElement } from "../element/PaperElement";
import { Point } from "../u/types";

export class MouseSensor {
    private sense: DrawEventHandler;

    public init(sense: DrawEventHandler, paper: PaperElement): void {
        this.sense = sense;
        paper.getCnv().addEventListener("mouseup", (e: MouseEvent) => this.sense.up("mouse", e, this.p(e)), { passive: false });
        paper.getCnv().addEventListener("mousedown", (e: MouseEvent) => this.sense.down("mouse", e, this.p(e)), { passive: false });
        paper.getCnv().addEventListener("mousemove", (e: MouseEvent) => this.sense.move("mouse", e, this.p(e)), { passive: false });
        paper.getCnv().addEventListener("mouseleave", (e: MouseEvent) => this.sense.up("mouse", e, this.p(e)), { passive: false });

        // // moveはscroll等にも使うのでbodyにも登録
        // const body:HTMLBodyElement = document.querySelector("body");
        // body.addEventListener("mouseup", (e: MouseEvent) => this.sense.upbody("mouse", e, this.p(e)), { passive: false });
        // body.addEventListener("mousedown", (e: MouseEvent) => this.sense.downbody("mouse", e, this.p(e)), { passive: false });
        // body.addEventListener("mousemove", (e: MouseEvent) => this.sense.movebody("mouse", e, this.p(e)), { passive: false });
    }

    private p(e: MouseEvent): Point {
        const x: number = e.offsetX;
        const y: number = e.offsetY;
        return new Point(x, y, 0);
    }
}
