import { Draw, Stroke, Point } from "../data/Draw";
import { PenAction } from "../action/PenAction";

export class DrawOther {
    private draws: Draw[]; // 自分以外＝複数人のデータがあるため
    private paper_id: number;
    private user_id: number | null;
    private after_paper_id: number;

    constructor() {
        this.draws = [];
        this.user_id = null;
        this.after_paper_id = 0;
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
            url = `/api/draw/${this.paper_id}/after/{${this.after_paper_id}`;
        }
        const response = await fetch(url);
        const text = await response.text();

        // 一旦空にして格納し直し
        this.draws.splice(0, this.draws.length);
        for(const d of JSON.parse(text)) {
            const obj = JSON.parse(d.json_draw);
            const draw = new Draw();
            draw.parse(obj);
            draw.setCreatedAt(d.created_at);
            draw.setId(d.id);
            this.draws.push(draw);
        }

        // 日付順でソート。jsonは順番が保証されない。
        this.draws = this.draws.sort((a: Draw, b: Draw) => {
            return a.isNewer(b);
        });
        // after用にidを保存
        if(this.draws.length > 0) {
            this.after_paper_id = this.draws[this.draws.length - 1].id;
        }
    }

    public getDraws(): Draw[] {
        return this.draws;
    }
}
