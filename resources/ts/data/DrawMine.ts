import { Draw, Stroke, Point, StrokeOption } from "../data/Draw";
import { PenAction } from "../action/PenAction";

export class DrawMine {
    private draw: Draw;
    private nowstroke: Stroke;
    private user_id: string | null;
    private paper_id: number;
    private pen: PenAction;
    private savedStroke: Stroke | null; // 保存したときのstroke

    constructor() {
        this.draw = new Draw();
        this.user_id = null;
        const urls: string[] = window.location.pathname.split("/");
        const paper_id: number = parseInt(urls[urls.length - 1]);
        this.paper_id = paper_id;
        this.savedStroke = null;
    }

    public init(pen: PenAction) {
        this.pen = pen;
        this.nowstroke = new Stroke(new StrokeOption(this.pen.opt.color, this.pen.opt.thick));
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
        this.nowstroke = new Stroke(this.pen.opt);
    }

    public endStroke(): void {
        // Strokeが終わったのでdrawにプッシュ
        if (this.nowstroke.length() > 0) {
            this.draw.push(this.nowstroke);
        }
    }
    public async save(): Promise<void> {
        const urls: string[] = window.location.pathname.split("/");
        const paper_id: number = parseInt(urls[urls.length - 1]);
        const url = `/api/draw/${paper_id}`;
        const postdata = new FormData();
        postdata.append("json_draw", this.draw.json());
        postdata.append("user_id", <string>this.user_id);
        const option: RequestInit = {
            method: "POST",
            body: postdata,
        }
        const response = await fetch(url, option);
        const res_save = JSON.parse(await response.text());
        if (this.user_id === null) {
            this.user_id = res_save.user_id.toString();
        }
        this.savedStroke = this.draw.peek();
    }

    public getDraw(): Draw {
        return this.draw;
    }

    public clear() {
        this.draw.clear();
    }

    public undo(): Stroke[] {
        this.draw.getStrokes().pop();
        const ret = this.draw.getStrokes();
        return ret;
    }

    public getNowStroke(): Stroke {
        return this.nowstroke;
    }

    /**
     * 保存したストローク数が正しければ保存済み。増えるばかりではなく、undoで減る場合もあり。
     */
    public isSaved(): boolean {
        const ret: boolean = this.savedStroke === this.draw.peek();
        return ret;
    }
}
