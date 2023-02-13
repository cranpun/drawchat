import { Drawing } from "../data/Drawing";
import * as U from "../u/u";


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

abstract class ShapeProc {
    protected abstract proc(draw: Drawing): void;
    async exec(draw: Drawing): Promise<void> {
        await this.proc(draw);
    }
}

class ShapeProcFill extends ShapeProc {
    private cw: number;
    private ch: number;
    constructor(cw: number, ch: number) {
        super();
        this.cw = cw;
        this.ch = ch;
    }
    protected proc(draw: Drawing): void {
        draw.paper.pen.saveOpt();

        // ペンの太さを太く
        draw.paper.pen.opt.thick = this.cw;

        // 上から縦に極太を引いて塗りつぶし
        draw.startStroke();
        // 左から右に
        draw.pushPoint(this.cw / 2, 0);
        draw.pushPoint(this.cw / 2, this.ch);

        draw.endStroke();

        draw.paper.pen.restoreOpt();
        draw.paper.draw([draw.getDraw()]);
    }

}