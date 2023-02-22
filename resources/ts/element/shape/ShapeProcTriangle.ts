import { Point } from "../../data/Draw";
import { DrawingCanvas } from "../../data/DrawingCanvas";
import { ShapeProc } from "./ShapeProc";

export class ShapeProcTriangle extends ShapeProc {
    private cw: number;
    private ch: number;
    constructor(cw: number, ch: number) {
        super();
        this.cw = cw;
        this.ch = ch;
    }

    protected proc(draw: DrawingCanvas, pos: Point | null): void {
        if (!pos) {
            this.startAskPos(draw);
        } else {
            draw.paper.pen.saveOpt();

            // 上から縦に極太を引いて塗りつぶし
            draw.startStroke();

            // 記述本体
            const len = this.cw / 4; // 辺の長さ。横幅基準
            const h = len * Math.sin(Math.PI / 3);// 縦の長さ。辺 * sin(60°）。横幅は三平方の定理から半分。
            draw.pushPoint(pos.x, pos.y);
            draw.pushPoint(pos.x + len / 2, pos.y + h); // 上→右下
            draw.pushPoint(pos.x - len / 2, pos.y + h); // 右下→左下
            draw.pushPoint(pos.x, pos.y); // 左下→上

            draw.endStroke();

            draw.paper.pen.restoreOpt();
            draw.paper.draw([draw.stroke]);
        }
    }

}