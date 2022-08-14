import { Draw, Stroke, Point } from "../data/Draw";
import { MyAxiosApi } from "../u/myaxios";
import { PenAction } from "../action/PenAction";
import "../window"

export class DrawOther {
    private draws: Draw[]; // 自分以外＝複数人のデータがあるため
    private paper_id: number;
    private pen: PenAction;
    private user_id: number | null;

    constructor() {
        this.draws = [];
        this.user_id = null;
        const urls: string[] = window.location.pathname.split("/");
        const paper_id: number = parseInt(urls[urls.length - 1]);
        this.paper_id = paper_id;
    }

    public init(pen: PenAction) {
        this.pen = pen;
    }
    public async load(): Promise<void> {
        const url = `/api/draw/${this.paper_id}/other/${this.user_id === null ? 0 : this.user_id}`;
        const response = await fetch(url);
        const text = await response.text();

        for(const d of JSON.parse(text)) {
            const obj = JSON.parse(d.json_draw);
            const draw = new Draw();
            draw.parse(obj);
            this.draws.push(draw);
        }
    }

    public async loadAxios(): Promise<void> {
        const api_load: MyAxiosApi = window.axios.get(`/api/draw/${this.paper_id}/other/${this.user_id === null ? 0 : this.user_id}`);

        try {
            const [res_load] = await window.axios.all([api_load]);
            for(const d of (<any[]>res_load.data)) {
                const obj = JSON.parse(d.json_draw);
                const draw = new Draw();
                draw.parse(obj);
                this.draws.push(draw);
            }
        } catch (error) {
            console.error(error);
        }
    }

    public getDraws(): Draw[] {
        return this.draws;
    }
}
