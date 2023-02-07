import { Draw, Stroke, Point } from "./Draw";
import { PenAction } from "../action/PenAction";

export class Drawstore {
    private draws: Draw[]; // 自分以外＝複数人のデータがあるため
    private paper_id: number;

    constructor() {
        this.draws = [];
        const urls: string[] = window.location.pathname.split("/");
        const paper_id: number = parseInt(urls[urls.length - 1]);
        this.paper_id = paper_id;
    }

    public async load(): Promise<void> {
        const url = `/api/draw/${this.paper_id}`;
        const response = await fetch(url);
        const text = await response.text();

        // 一旦空にして格納し直し
        this.draws.splice(0, this.draws.length);
        for(const d of JSON.parse(text)) {
            const obj = JSON.parse(d.json_draw);
            const draw = new Draw();
            draw.setIDs(d.id, d.user_id);
            draw.parse(obj);
            draw.setCreatedAt(d.created_at);
            this.draws.push(draw);
        }

        // 日付順でソート。jsonは順番が保証されない。
        this.draws = this.draws.sort((a: Draw, b: Draw) => {
            return a.isNewer(b);
        });
    }

    public getDraws(): Draw[] {
        return this.draws;
    }

    public addDraws(draw: Draw): void {
        this.draws.push(draw);
    }
}
