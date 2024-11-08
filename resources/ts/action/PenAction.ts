import { Point, StrokeOption } from "../data/Draw";
import { CanvasElement } from "../element/CanvasElement";
import * as U from "../u/u";
import rfdc from "rfdc";
import { SaveElement } from "../element/SaveElement";

export class PenAction {

    public readonly opt:StrokeOption = new StrokeOption("", 0);
    public eraser: boolean;

    private optbk: any;
    private clone = rfdc();

    public init(opt: StrokeOption) {
        this.eraser = false;
        this.opt.update(opt);
        this.optbk = null;
    }

    public proc(x: number, y: number, prep: Point | null, paper: CanvasElement): void {
        let pre = prep;
        if (pre == null) {
            // 前回の点がなければ今回の点
            pre = new Point(x, y);
        }
        const ctx = paper.getCtx();

        if (this.eraser) {
            this.erase(x, y, pre, ctx)
        } else {
            this.pen(x, y, pre, ctx);
        }

        // // メニューは閉じる
        // document.querySelectorAll(".is-active").forEach(ele => {
        //     ele.classList.remove("is-active");
        // });
    }
    private pen(x: number, y: number, pre: Point, ctx: CanvasRenderingContext2D): void {
        ctx.save()
        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineWidth = this.opt.thick;
        ctx.strokeStyle = this.opt.color;
        ctx.moveTo(pre.x, pre.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();
    }
    private erase(x: number, y: number, pre: Point, ctx: CanvasRenderingContext2D): void {
        ctx.save();
        // 移動距離で消す範囲を調整
        const d = Math.abs(x - pre.x) + Math.abs(y - pre.y);
        ctx.clearRect(x - d, y - d, d * 2, d * 2);
        ctx.restore();
    }

    public saveOpt() {
        this.optbk = this.clone(this.opt);
        // U.pd(this.optbk);
    }
    public restoreOpt() {
        for (const [idx, val] of Object.entries(this.optbk)) {
            this.opt[idx] = val;
        }
    }
}
