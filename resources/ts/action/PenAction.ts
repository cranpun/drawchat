import { DrawData } from "../data/DrawData";
import * as U from "../u/u";
import { PaperElement } from "../element/PaperElement";
import { Point } from "../u/types";
import { EraserElement } from "../element/EraserElement";

export class PenAction {
    eraser: EraserElement;

    public init(eraser: EraserElement) {
        this.eraser = eraser;
    }

    public proc(x: number, y: number, prep: Point, paper: PaperElement): void {
        let pre = prep;
        if (pre == null) {
            // 前回の点がなければ今回の点
            pre = new Point(x, y);
        }
        const ctx = paper.getCtx();

        if(this.eraser.enable) {
            this.erase(x, y, pre, ctx)
        } else {
            this.pen(x, y, pre, ctx);
        }
    }
    private pen(x: number, y: number, pre: Point, ctx: CanvasRenderingContext2D):void {
        ctx.save()
        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.eraser.enable ? "#F00" : "#0F0";
        ctx.moveTo(pre.x, pre.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();
    }
    private erase(x: number, y: number, pre: Point, ctx: CanvasRenderingContext2D):void {
        ctx.save();
        // 移動距離で消す範囲を調整
        const d = Math.abs(x - pre.x) + Math.abs(y - pre.y);
        ctx.clearRect(x -d, y - d, d * 2, d * 2);
        ctx.restore();
    }
}
