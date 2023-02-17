import { Draw, Stroke, Point, StrokeOption } from "./Draw";
import { PenAction } from "../action/PenAction";
import { SaveElement } from "../element/SaveElement";
import * as U from "../u/u";
import { Drawstore } from "./Drawstore";
import { PaperElement } from "../element/PaperElement";
import { ShapeProc } from "../element/shape/ShapeProc";

export class Drawing {
    private draw: Draw;
    private nowstroke: Stroke;
    private paper_id: number;
    private _paper: PaperElement;
    private drawstore: Drawstore;
    private _askPosProc: ShapeProc | null;

    constructor(opt: StrokeOption, drawstore: Drawstore) {
        this.initDraw();
        const urls: string[] = window.location.pathname.split("/");
        this.paper_id = parseInt(urls[urls.length - 1]); // urlの末尾がページID
        this._paper = PaperElement.makeDrawing(opt);
        this.drawstore = drawstore;
        this._askPosProc = null;
    }

    get paper(): PaperElement {
        return this._paper;
    }

    get isAskingPos(): ShapeProc | null {
        return this._askPosProc;
    }
    set isAskingPos(v: ShapeProc | null) {
        this._askPosProc = v;
    }


    private initDraw(): void {
        this.draw = new Draw();
    }

    public pushPoint(x: number, y: number): void {
        const p = new Point(x, y);
        this.nowstroke.push(p);
    }

    public lastPoint(): Point | null {
        return this.nowstroke.lastPoint();
    }

    public startStroke(): void {
        // 次に備えてstrokeをクリア
        this.nowstroke = new Stroke(this.paper.pen.opt);
    }

    public endStroke(): void {
        // Strokeが終わったのでdrawにプッシュ
        if (this.nowstroke.length() > 0) {
            this.draw.push(this.nowstroke);
            this.showLabelNosave();
        }
    }
    public async save(): Promise<void> {
        if (!this.isSaved()) {
            // 保存　→　drawstoreロード（保存したデータがDatastoreに）　→　クリアして再描画
            // まず現在のdrawを退避してクリア。次のdrawを受け付けるため。
            const json_draw: string = this.draw.json();
            this.initDraw();

            // 保存
            const url = `/api/draw/${this.paper_id}/add`;
            const postdata = U.makeCsrf();
            postdata.append("json_draw", json_draw);
            const option: RequestInit = {
                method: "POST",
                body: postdata,
            }
            const response = await fetch(url, option);
            const text = await response.text();

            // datastoreにデータ反映してredraw
            this.drawstore.update(text);
            this.drawstore.draw();

            // 再描画
            this.paper.clear();
            await this.paper.draw([this.draw]);

        }
        this.showLabelSaved();
    }

    public autosave() {
        const sec = 3;
        const proc = async () => {
            await this.save();
            setTimeout(proc, sec * 1000);
        }
        (async () => await proc())();
    }

    public getDraw(): Draw {
        return this.draw;
    }

    public clear() {
        this.draw.clear();
    }

    public async undo(): Promise<void> {

        if(this.isSaved()) {
            this.drawstore.undo();
        } else {
            // 保存前なのでそこだけ書き直し
            this.draw.getStrokes().pop();
            this.paper.clear();
            this.paper.draw([this.draw]);
        }
    }

    public getNowStroke(): Stroke {
        return this.nowstroke;
    }

    public isSaved(): boolean {
        const ret: boolean = this.draw.getStrokes().length <= 0;
        return ret;
    }

    public showLabelNosave() {
        this.updateLabel("not saved", true);
    }
    private showLabelSaved() {
        this.updateLabel("saved", false);
    }
    private updateLabel(label: string, isDanger: boolean) {
        const ele: HTMLElement = <HTMLElement>document.querySelector("#label-save");
        // format(new Date(), 'kk:mm:ss')
        ele.innerText = label;
        if (isDanger) {
            ele.classList.add("has-text-danger");
        } else {
            ele.classList.remove("has-text-danger");
        }
    }
}
