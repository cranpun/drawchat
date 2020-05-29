import { Point, Stroke, Desc } from "./types";

export class Paper {
    private cnv: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(cnv: HTMLCanvasElement) {
        this.cnv = cnv;
        this.ctx = this.cnv.getContext("2d");
    }

    // public redraw() {
    //     this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);

    // }

    public stroke(x: number, y: number, prep: Point): void {
        let pre: Point = prep;
        if (prep == null) {
            // 前回の点がなければ今回の点
            pre = new Point(x, y, 0);
        }
        this.ctx.save()
        this.ctx.beginPath();
        this.ctx.lineCap = "round";
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "#000";
        this.ctx.moveTo(pre.x, pre.y);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.restore()
    }

    public redraw(desc: Desc): void {
        const strokes: Stroke[] = desc.getStrokes();
        let prepoint = null;
        for (const s of strokes) {
            for (const p of s.getPoints()) {
                this.stroke(p.x, p.y, prepoint);
                prepoint = p;
            }
            prepoint = null;
        }
    }
}
