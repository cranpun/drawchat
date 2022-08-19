import { Draw, Stroke, Point } from "../data/Draw";
import { PenAction } from "../action/PenAction";

export class DrawOther {
    private draws: Draw[]; // 自分以外＝複数人のデータがあるため
    private paper_id: number;
    private user_id: number | null;

    constructor() {
        this.draws = [];
        this.user_id = null;
        const urls: string[] = window.location.pathname.split("/");
        const paper_id: number = parseInt(urls[urls.length - 1]);
        this.paper_id = paper_id;
    }

    public async load(): Promise<void> {
        let url = "";
        if(this.user_id) {
            // user_idの指定があれば自分以外。
            url = `/api/draw/${this.paper_id}/others/${this.user_id}`;
        } else {
            // user_id
            url = `/api/draw/${this.paper_id}`;
        }
        const response = await fetch(url);
        const text = await response.text();

        // 一旦空にして格納し直し
        this.draws.splice(0, this.draws.length);
        for(const d of JSON.parse(text)) {
            const obj = JSON.parse(d.json_draw);
            const draw = new Draw();
            draw.parse(obj);
            this.draws.push(draw);
        }
    }

    public getDraws(): Draw[] {
        return this.draws;
    }
}
