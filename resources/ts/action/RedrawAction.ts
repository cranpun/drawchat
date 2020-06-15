import { DrawData } from "../data/DrawData";
import * as U from "../u/u";
import { PaperElement } from "../element/PaperElement";
import { Draw, Stroke, Point } from "../u/types";
import { PenAction } from "./PenAction";
import { ColorElement } from "../element/ColorElement";
import "../window";

export class RedrawAction {
    private first: boolean = true; // 初回フラグ。ロード時にバタつくため。
    public async proc(paper: PaperElement, datastore: DrawData, pen: PenAction): Promise<void> {
        const strokes: Stroke[] = datastore.getDraw().getStrokes();

        let prepoint: Point = null;
        if(this.first) {
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
        if(this.first) {
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
