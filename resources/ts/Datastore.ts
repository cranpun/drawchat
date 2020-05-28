import { Desc, Stroke, Point } from "./types";

export class Datastore {
    private desc: Desc;
    private nowstroke: Stroke;
    private time_prepush: number;

    constructor() {
        this.desc = new Desc();
        this.nowstroke = new Stroke();
        this.time_prepush = 0;
    }
    public pushPoint(x: number, y: number): void {
        const now = Date.now();
        if (this.desc.getStrokes().length === 0) {
            // 初回は現在時間で初期化
            this.time_prepush = now;
        }
        const p = new Point(x, y, this.time_prepush - now);
        this.nowstroke.push(p);
    }

    public lastPoint(): Point | null {
        return this.nowstroke.lastPoint();
    }

    public endStroke(): void {
        // Strokeが終わったのでdescにプッシュ
        if (this.nowstroke.length() > 0) {
            this.desc.push(this.nowstroke);
            // 次に備えてstrokeをクリア
            this.nowstroke.clear();
        }
    }
}
