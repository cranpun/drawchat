import { Draw, Stroke, Point, StrokeOption } from "./Draw";
import { PenAction } from "../action/PenAction";
import { PaperElement } from "../element/PaperElement";

export class Drawstore {
    private draws: Draw[]; // 自分以外＝複数人のデータがあるため
    private paper_id: number;
    private _paper: PaperElement;

    constructor(opt: StrokeOption) {
        this.draws = [];
        const urls: string[] = window.location.pathname.split("/");
        const paper_id: number = parseInt(urls[urls.length - 1]);
        this.paper_id = paper_id;
        this._paper = PaperElement.makeDrawstore(opt);
    }

    get paper(): PaperElement {
        return this._paper;
    }

    public async load(): Promise<void> {
        const url = `/api/draw/${this.paper_id}`;
        const response = await fetch(url);
        const text = await response.text();

        // 一旦空にして格納し直し
        this.draws.splice(0, this.draws.length);
        for (const d of JSON.parse(text)) {
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

    public draw(): void {
        this.paper.draw(this.draws);
    }

    public getPaper(): PaperElement {
        return this.paper;
    }

    public getDraws(): Draw[] {
        return this.draws;
    }

    public addDraws(draw: Draw): void {
        this.draws.push(draw);
    }

    public autoload(): void {
        const sec = 3;
        const proc = async () => {
            await this.load();
            this.paper.draw(this.draws);
            setTimeout(proc, sec * 1000);
        };
        (async () => await proc())();
    }
}
