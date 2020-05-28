import { Point } from "./types";
import { Datastore } from "./Datastore";

export class Paper {
    private cnv: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private datastore: Datastore;

    constructor(cnv: HTMLCanvasElement) {
        this.cnv = cnv;
        this.ctx = this.cnv.getContext("2d");
        this.datastore = new Datastore();
    }

    // public redraw() {
    //     this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);

    // }

    public stroke(x: number, y: number): void {
        // strokeを記述
        let pre: Point | null = this.datastore.lastPoint();
        if (pre === null) {
            // 最初の点なので支点も今回の部分
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

        // データを保存
        this.datastore.pushPoint(x, y);
    }

    public endStroke(): void {
        this.datastore.endStroke();
    }
}
