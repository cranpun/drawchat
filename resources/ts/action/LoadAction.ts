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
            // 自分のデータを保存してクリア
            if(this.datastores.mine.getDraw().length() > 0) {
                await this.datastores.mine.save();
                await this.datastores.mine.clear();
            }

            // 一度読み込み直し
            await this.datastores.other.load();
            await this.redraw(this.papers.other, this.datastores.other.getDraws(), this.pen);
            // U.toast.normal(`load ${sec} sec.`);
            // U.pd("loaded!!");

            // redrawが終わった後（＝other canvasに自分の記述が反映された後で消すことで、画面のぱたぱたをなくす）
            // 元の記述があるにしろないにしろデータはクリアされているはずのなので常にpaperクリア
            // また書き始めているかもしれないのでクリア前にチェック
            if(!this.drawstatus.isDrawing()) {
                await this.papers.mine.clear();
            }
        }
        if (periodic) {
            const sec = 3;
            setTimeout(() => this.proc(true), sec * 1000);
        }
    }

    private first: boolean = true; // 初回フラグ。ロード時にバタつくため。
    private async redraw(paper: PaperElement, draws: Draw[], pen: PenAction): Promise<void> {

        // pen状態の保存
        pen.saveOpt();

        // canvasのクリア
        // paper.clear();

        let prepoint: Point | null = null;
        if (this.first) {
            paper.getCnv().style.visibility = "hidden";
        }
        for (const draw of draws) {
            console.log(draw.id);
            // 現在のcanvasの状態をクローン
            // const bkimg: HTMLImageElement = await this.toImage(paper.getCnv());

            // 今回の記述を生成
            const strokes = draw.getStrokes();
            for (const s of strokes) {

                pen.opt.update(s.opt);
                pen.eraser = s.isEraser();
                for (const p of s.getPoints()) {
                    pen.proc(p.x, p.y, prepoint, paper);
                    prepoint = p;
                }
                prepoint = null;
            }

            // 取っておいたcanvasと重ね合わせ
            // paper.getCtx().drawImage(bkimg, 0, 0, bkimg.width, bkimg.height);
        }
        if (this.first) {
            paper.getCnv().style.visibility = "visible";
            this.first = false;
        }

        // pen状態の復旧
        pen.restoreOpt();
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
