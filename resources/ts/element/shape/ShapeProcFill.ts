import { Drawing } from "../../data/Drawing";
import { ShapeProc } from "./ShapeProc";

export class ShapeProcFill extends ShapeProc {
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