import { PenAction } from "../action/PenAction";
import { Stroke, Point, StrokeOption } from "../data/Draw";

export class CanvasElement {
    private cnv: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private _pen: PenAction;

    public static makeDrawing(opt: StrokeOption): CanvasElement {
        return new CanvasElement("#canvas-drawing", opt);
    }
    public static makeDrawstore(opt: StrokeOption): CanvasElement {
        return new CanvasElement("#canvas-drawn", opt);
    }
    private constructor(selector: string, opt: StrokeOption) {
        this.cnv = document.querySelector(selector);
        this.ctx = this.cnv.getContext("2d");
        this._pen = new PenAction();
        this.pen.init(opt);
    }

    public getCtx(): CanvasRenderingContext2D {
        return this.ctx;
    }
    public getCnv(): HTMLCanvasElement {
        return this.cnv;
    }

    get pen(): PenAction {
        return this._pen;
    }

    public clear(): void {
        const w: number = this.cnv.width;
        const h: number = this.cnv.height;
        this.ctx.clearRect(0, 0, w, h);
    }

    public draw(strokes: Stroke[]): void {

        // pen状態の保存
        this.pen.saveOpt();

        let prepoint: Point | null = null;
        for (const s of strokes) {

            this.pen.opt.update(s.opt);
            this.pen.eraser = s.isEraser();
            for (const p of s.points) {
                this.pen.proc(p.x, p.y, prepoint, this);
                prepoint = p;
            }
            prepoint = null;
        }

        // pen状態の復旧
        this.pen.restoreOpt();
    }
}
