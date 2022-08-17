import { DrawOther } from "../data/DrawOther";
import * as U from "../u/u";
import { PaperElement } from "../element/PaperElement";
import { PenAction } from "./PenAction";
import { Stroke, Point, Draw } from "../data/Draw";
import { DrawMine } from "../data/DrawMine";
import { DrawStatus } from "../data/DrawStatus";

export class LoadAction {
    private papers: {
        mine: PaperElement,
        other: PaperElement
    };
    private datastores: {
        mine: DrawMine,
        other: DrawOther
    };
    private pen: PenAction;
    private drawstatus: DrawStatus;
    public init(papermine: PaperElement, paperother: PaperElement, drawmine: DrawMine, drawother: DrawOther, pen: PenAction, drawstatus: DrawStatus) {
        this.papers = {
            mine: papermine,
            other: paperother,
        }
        this.datastores = {
            mine: drawmine,
            other: drawother
        };
        this.pen = pen;
        this.drawstatus = drawstatus;
        // U.toast.normal("now loading...");
        this.proc(true);
    }
    public async proc(periodic: boolean): Promise<void> {

        if (!this.drawstatus.isDrawing()) {
            // 記述中ならデータ整理しない

            // まず今の自分のデータを保存
            await this.datastores.mine.save();

            // 一度読み込み直し
            await this.datastores.other.load();

            // 自分のデータはotherに移動させる
            await this.papers.mine.clear();
            await this.datastores.mine.clear();
            await this.redraw(this.papers.other, this.datastores.other, this.pen);
            // U.toast.normal(`load ${sec} sec.`);
            // U.pd("loaded!!");
        }
        if (periodic) {
            const sec = 3;
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
