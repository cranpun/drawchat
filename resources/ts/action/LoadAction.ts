import { DrawData } from "../data/DrawData";
import * as U from "../u/u";
import { PaperElement } from "../element/PaperElement";
import { PenAction } from "./PenAction";
import { Stroke, Point } from "../data/Draw";

export class LoadAction {
    private paper: PaperElement;
    private datastore: DrawData;
    private pen: PenAction;
    public init(paper: PaperElement, datastore: DrawData, pen: PenAction) {
        this.paper = paper;
        this.datastore = datastore;
        this.pen = pen;
        this.proc();
    }
    public async proc(): Promise<void> {
        await this.datastore.load();
        await this.redraw(this.paper, this.datastore, this.pen);
        console.log("loaded!!");
        setTimeout(() => this.proc(), 7 * 1000);
    }

    private first: boolean = true; // 初回フラグ。ロード時にバタつくため。
    private async redraw(paper: PaperElement, datastore: DrawData, pen: PenAction): Promise<void> {
        const strokes: Stroke[] = datastore.getDraw().getStrokes();

        let prepoint: Point = null;
        if (this.first) {
            console.log("hidden");
            paper.getCnv().style.visibility = "hidden";
        }
        for (const s of strokes) {
            // 現在のcanvasの状態をクローン
            const bkimg: HTMLImageElement = await this.toImage(paper.getCnv());

            // クリアして今回の記述を書き込み
            paper.clear();

            if (s.isEraser()) {
                pen.color = s.color; // 色情報は使わないが念の為設定
                pen.eraser = true;
            } else {
                pen.color = s.color;
                pen.eraser = false;
            }
            for (const p of s.getPoints()) {
                pen.proc(p.x, p.y, prepoint, paper);
                prepoint = p;
            }
            prepoint = null;

            // 取っておいたcanvasと重ね合わせ
            paper.getCtx().drawImage(bkimg, 0, 0, bkimg.width, bkimg.height);
        }
        if (this.first) {
            console.log("visible");
            paper.getCnv().style.visibility = "visible";
            this.first = false;
        }
    }

    private async toImage(cnv: HTMLCanvasElement): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const image: HTMLImageElement = new Image();
            const ctx: CanvasRenderingContext2D = cnv.getContext("2d");
            image.onload = () => resolve(image);
            image.onerror = (e) => reject(e);
            image.src = ctx.canvas.toDataURL();
        });
    }
}
