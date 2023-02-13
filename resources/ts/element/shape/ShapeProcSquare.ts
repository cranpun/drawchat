import { Point } from "../../data/Draw";
import { Drawing } from "../../data/Drawing";
import { ShapeProc } from "./ShapeProc";

export class ShapeProcSquare extends ShapeProc {
    private cw: number;
    private ch: number;
    constructor(cw: number, ch: number) {
        super();
        this.cw = cw;
        this.ch = ch;
    }

    protected proc(draw: Drawing, pos: Point | null): void {
        if (!pos) {
            this.startAskPos(draw);
        } else {
            draw.paper.pen.saveOpt();

            // 上から縦に極太を引いて塗りつぶし
            draw.startStroke();

            // 記述本体
            const len = this.cw / 4; // 一片の長さ。横幅基準
            draw.pushPoint(pos.x, pos.y);
            draw.pushPoint(pos.x + len, pos.y); // 左上→右上
            draw.pushPoint(pos.x + len, pos.y + len); // 右上→右下
            draw.pushPoint(pos.x, pos.y + len); // 右下→左下
            draw.pushPoint(pos.x, pos.y); // 左下→左上

            draw.endStroke();

            draw.paper.pen.restoreOpt();
            draw.paper.draw([draw.getDraw()]);
        }
    }

}