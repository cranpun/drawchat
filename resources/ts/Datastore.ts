import { Desc, Stroke, Point } from "./types";
import { MyAxiosApi } from "./myaxios";

export class Datastore {
    private d: Desc;
    private nowstroke: Stroke;
    private time_prepush: number;
    private user_id: string;

    constructor() {
        this.d = new Desc();
        this.nowstroke = new Stroke();
        this.time_prepush = 0;
        this.user_id = null;
    }
    public pushPoint(x: number, y: number): void {
        const now = Date.now();
        if (this.d.getStrokes().length === 0) {
            // 初回は現在時間で初期化
            this.time_prepush = now;
        }
        const p = new Point(x, y, now - this.time_prepush);
        this.time_prepush = now;
        this.nowstroke.push(p);
    }

    public lastPoint(): Point | null {
        return this.nowstroke.lastPoint();
    }

    public endStroke(): void {
        // Strokeが終わったのでdescにプッシュ
        if (this.nowstroke.length() > 0) {
            this.d.push(this.nowstroke);
            // 次に備えてstrokeをクリア
            this.nowstroke = new Stroke();
        }
    }

    public async save(): Promise<void> {
        const urls: string[] = window.location.pathname.split("/");
        const room_id: number = parseInt(urls[urls.length - 1]);
        let postdata = {
            json_desc: this.d.json(),
            user_id: this.user_id
        };
        const api_save: MyAxiosApi = window.axios.post(`/api/desc/${room_id}`, postdata);

        try {
            const [res_save] = await window.axios.all([api_save]);
            if (this.user_id === null) {
                this.user_id = res_save.data["user_id"].toString();
            }
            console.log(res_save);
        } catch (error) {
            console.error(error);
        }
    }

    public async load(): Promise<void> {
        const urls: string[] = window.location.pathname.split("/");
        const room_id: number = parseInt(urls[urls.length - 1]);
        const api_load: MyAxiosApi = window.axios.get(`/api/desc/${room_id}`);

        try {
            const [res_load] = await window.axios.all([api_load]);
            // 暫定処置。全部同じキャンバスに描画
            let strokes: any[] = [];
            for(const d of (<any[]>res_load.data)) {
                const obj = JSON.parse(d.json_desc);
                strokes = strokes.concat(obj);
            }
            this.d.parse(strokes);
        } catch (error) {
            console.error(error);
        }
    }

    public getDesc(): Desc {
        return this.d;
    }
}
