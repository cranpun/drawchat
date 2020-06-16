import { Draw, Stroke, Point } from "../data/Draw";
import { MyAxiosApi } from "../u/myaxios";
import { PenAction } from "../action/PenAction";
import "../window"

export class DrawMine {
    private d: Draw;
    private nowstroke: Stroke;
    private user_id: string;
    private paper_id: number;
    private pen: PenAction;

    constructor() {
        this.d = new Draw();
        this.nowstroke = new Stroke();
        this.user_id = null;
        const urls: string[] = window.location.pathname.split("/");
        const paper_id: number = parseInt(urls[urls.length - 1]);
        this.paper_id = paper_id;
    }

    public init(pen: PenAction) {
        this.pen = pen;
    }

    public pushPoint(x: number, y: number): void {
        const now = Date.now();
        if (this.nowstroke.length() === 0) {
            // 最初の点ならcolorの設定
            this.nowstroke.color = this.pen.opt.eraser ? Stroke.TK_ERASER : this.pen.opt.color;
        }
        const p = new Point(x, y);
        this.nowstroke.push(p);
    }

    public lastPoint(): Point | null {
        return this.nowstroke.lastPoint();
    }

    public endStroke(): void {
        // Strokeが終わったのでdrawにプッシュ
        if (this.nowstroke.length() > 0) {
            this.d.push(this.nowstroke);
            // 次に備えてstrokeをクリア
            this.nowstroke = new Stroke();
        }
    }

    public async save(): Promise<void> {
        const urls: string[] = window.location.pathname.split("/");
        const paper_id: number = parseInt(urls[urls.length - 1]);
        let postdata = {
            json_draw: this.d.json(),
            user_id: this.user_id
        };
        const api_save: MyAxiosApi = window.axios.post(`/api/draw/${paper_id}`, postdata);

        try {
            const [res_save] = await window.axios.all([api_save]);
            if (this.user_id === null) {
                this.user_id = res_save.data["user_id"].toString();
            }
        } catch (error) {
            console.error(error);
        }
    }

    public async load(): Promise<void> {
        const api_load: MyAxiosApi = window.axios.get(`/api/draw/${this.paper_id}/mine/${this.user_id === null ? 0 : this.user_id}`);

        try {
            const [res_load] = await window.axios.all([api_load]);
            let strokes: any[] = [];
            for(const d of (<any[]>res_load.data)) {
                const obj = JSON.parse(d.json_draw);
                strokes = strokes.concat(obj);
            }
            this.d.parse(strokes);
        } catch (error) {
            console.error(error);
        }
    }

    public getDraw(): Draw {
        return this.d;
    }
    public getNowStroke(): Stroke {
        return this.nowstroke;
    }
}
