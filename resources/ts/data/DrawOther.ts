import { Draw, Stroke, Point } from "../data/Draw";
import { PenAction } from "../action/PenAction";

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

    public getDraws(): Draw[] {
        return this.draws;
    }
}
