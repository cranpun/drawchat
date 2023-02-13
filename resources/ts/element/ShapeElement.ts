import { Drawing } from "../data/Drawing";
import * as U from "../u/u";
import { ShapeProc } from "./shape/ShapeProc";
import { ShapeProcFill } from "./shape/ShapeProcFill";
import { ShapeProcSquare } from "./shape/ShapeProcSquare";
import { ShapeProcTriangle } from "./shape/ShapeProcTriangle";

export class ShapeElement {
    private draw: Drawing;
    private cw: number;
    private ch: number;
    private shapeProcs: { [index: string]: ShapeProc };
    constructor() {
        document.querySelectorAll(".act-shape").forEach((ele: HTMLElement) => {
            ele.addEventListener("click", (ev: Event) => {
                this.proc(ev);
            });
            ele.addEventListener("touchend", (ev: Event) => this.proc(ev));
        });
    }
    public init(draw: Drawing, cw: number, ch: number) {
        this.draw = draw;
        this.cw = cw;
        this.ch = ch;
        this.shapeProcs = {
            "fill": new ShapeProcFill(this.cw, this.ch),
            "square": new ShapeProcSquare(this.cw, this.ch),
            "triangle": new ShapeProcTriangle(this.cw, this.ch),
        }
    }
    private async proc(ev: Event): Promise<void> {
        const shape = this.getShape(ev);
        await this.shapeProcs[shape].exec(this.draw);
    }

    private getShape(ev: Event): string {
        const ele = <HTMLElement>ev.target;
        let parent = ele;
        while (!parent.hasAttribute("data-shape")) {
            parent = ele.parentElement;
        }
        const shape: string = parent.getAttribute("data-shape");
        return shape;
    }

}
