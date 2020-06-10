import { DrawEventHandler } from "../DrawEventHandler";
import { PaperElement } from "../element/PaperElement";
import { Point } from "../u/types";

export class PointerSensor {
    private sense: DrawEventHandler;

    public init(sense: DrawEventHandler, paper: PaperElement): void {
        this.sense = sense;
        paper.getCnv().addEventListener("pointerup", (e: PointerEvent) => this.sense.up("pointer", e, this.p(e)), { passive: false });
        paper.getCnv().addEventListener("pointerdown", (e: PointerEvent) => this.sense.down("pointer", e, this.p(e)), { passive: false });
        paper.getCnv().addEventListener("pointermove", (e: PointerEvent) => this.sense.move("pointer", e, this.p(e)), { passive: false });
        paper.getCnv().addEventListener("pointerleave", (e: PointerEvent) => this.sense.up("pointer", e, this.p(e)), { passive: false });

        // // moveはscroll等にも使うのでbodyにも登録
        // const body: HTMLBodyElement = document.querySelector("body");
        // body.addEventListener("pointermove", (e: PointerEvent) => this.movebody("pointer", e, this.p(e)), false);
    }

    private p(e): Point {
        const x: number = e.offsetX;
        const y: number = e.offsetY;
        return new Point(x, y, 0);
    }
}
