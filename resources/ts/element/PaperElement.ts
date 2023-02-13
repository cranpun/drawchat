import { PenAction } from "../action/PenAction";
import { Draw, Stroke, Point, StrokeOption } from "../data/Draw";

export class PaperElement {
    private cnv: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private _pen: PenAction;
    private first: boolean;

    public static makeDrawing(opt: StrokeOption): PaperElement {
        return new PaperElement("#canvas-drawing", opt);
    }
    public static makeDrawstore(opt: StrokeOption): PaperElement {
        return new PaperElement("#canvas-drawstore", opt);
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

    public draw(draws: Draw[]): void {

        // pen状態の保存
        this.pen.saveOpt();

        // canvasのクリア
        // paper.clear();

        let prepoint: Point | null = null;
        if (this.first) {
            this.getCnv().style.visibility = "hidden";
        }
        for (const draw of draws) {
            // 今回の記述を生成
            const strokes = draw.getStrokes();
            for (const s of strokes) {

                this.pen.opt.update(s.opt);
                this.pen.eraser = s.isEraser();
                for (const p of s.getPoints()) {
                    this.pen.proc(p.x, p.y, prepoint, this);
                    prepoint = p;
                }
                prepoint = null;
            }

            // 取っておいたcanvasと重ね合わせ
            // paper.getCtx().drawImage(bkimg, 0, 0, bkimg.width, bkimg.height);
        }

        if (this.first) {
            this.getCnv().style.visibility = "visible";
            this.first = false;
        }

        // pen状態の復旧
        this.pen.restoreOpt();
    }
}
