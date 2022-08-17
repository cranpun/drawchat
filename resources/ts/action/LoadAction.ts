import { DrawOther } from "../data/DrawOther";
import * as U from "../u/u";
import { PaperElement } from "../element/PaperElement";
import { PenAction } from "./PenAction";
import { Stroke, Point, Draw } from "../data/Draw";

export class LoadAction {
    private paper: PaperElement;
    private datastore: DrawOther;
    private pen: PenAction;
    public init(paper: PaperElement, datastore: DrawOther, pen: PenAction) {
        this.paper = paper;
        this.datastore = datastore;
        this.pen = pen;
        // U.toast.normal("now loading...");
        this.proc(true);
    }
    public async proc(periodic: boolean): Promise<void> {
        const sec = 3;
        await this.datastore.load();
        await this.redraw(this.paper, this.datastore, this.pen);
        // U.toast.normal(`load ${sec} sec.`);
        // U.pd("loaded!!");
        if(periodic) {
            setTimeout(() => this.proc(true), sec * 1000);
        }
    }

    private first: boolean = true; // 初回フラグ。ロード時にバタつくため。
    private async redraw(paper: PaperElement, datastore: DrawOther, pen: PenAction): Promise<void> {
        const draws: Draw[] = datastore.getDraws();

        let prepoint: Point | null = null;
        if (this.first) {
            paper.getCnv().style.visibility = "hidden";
        }
        for (const draw of draws) {
            // 現在のcanvasの状態をクローン
            const bkimg: HTMLImageElement = await this.toImage(paper.getCnv());

            // クリアして今回の記述を書き込み
            paper.clear();

            // 今回の記述を生成
            const strokes = draw.getStrokes();
            for (const s of strokes) {

                if (s.isEraser()) {
                    pen.opt.color = s.color; // 色情報は使わないが念の為設定
                    pen.opt.eraser = true;
                } else {
                    pen.opt.color = s.color;
                    pen.opt.eraser = false;
                }
                for (const p of s.getPoints()) {
                    pen.proc(p.x, p.y, prepoint, paper);
                    prepoint = p;
                }
                prepoint = null;
            }

            // 取っておいたcanvasと重ね合わせ
            paper.getCtx().drawImage(bkimg, 0, 0, bkimg.width, bkimg.height);
        }
        if (this.first) {
            paper.getCnv().style.visibility = "visible";
            this.first = false;
        }
    }

    private async toImage(cnv: HTMLCanvasElement): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const image: HTMLImageElement = new Image();
            const ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>cnv.getContext("2d");
            image.onload = () => resolve(image);
            image.onerror = (e) => reject(e);
            image.src = ctx.canvas.toDataURL();
        });
    }
}
