import { Draw, Stroke, Point, StrokeOption } from "./Draw";
import { PenAction } from "../action/PenAction";
import { PaperElement } from "../element/PaperElement";
import { differenceInSeconds } from "date-fns";
import * as U from "../u/u";

export class Drawstore {
    private draws: Draw[]; // 自分以外＝複数人のデータがあるため
    private paper_id: number;
    private _paper: PaperElement;
    private draw_at: Date;

    constructor(opt: StrokeOption) {
        this.draws = [];
        const urls: string[] = window.location.pathname.split("/");
        const paper_id: number = parseInt(urls[urls.length - 1]);
        this.paper_id = paper_id;
        this._paper = PaperElement.makeDrawstore(opt);
        this.draw_at = null;
    }

    get paper(): PaperElement {
        return this._paper;
    }

    public async load(): Promise<void> {
        const url = `/api/draw/${this.paper_id}`;
        const response = await fetch(url);
        const text = await response.text();

        this.update(text);
    }

    public update(text: string): void {
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
        this.draw_at = new Date();
        console.log("draw");
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
            // 前回のdrawが直近であればやらない
            const diff: number = differenceInSeconds(new Date(), this.draw_at);
            if ((diff >= sec) || !this.draw_at) {
                await this.load();
                this.draw();
            }
            setTimeout(proc, sec * 1000);
        };
        (async () => await proc())();
    }
    public async undo(): Promise<void> {
        // 保存後なのでサーバデータ改変
        const url = `/api/draw/${this.paper_id}/undo`;
        const postdata = U.makeCsrf();
        const option: RequestInit = {
            method: "POST",
            body: postdata,
        }
        const response = await fetch(url, option);
        const text = await response.text();

        // datastoreにデータ反映してredraw
        this.update(text);
        this.draw();
    }
}
