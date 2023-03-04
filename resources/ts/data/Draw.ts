import { Tool } from "../u/types";

export class StrokeOption {
    public color: string;
    public thick: number;
    public tool: Tool;

    constructor(color: string, thick: number) {
        this.color = color;
        this.thick = thick;
    }
    update(opt: StrokeOption) {
        this.color = opt.color;
        this.thick = opt.thick;
    }
}

export class Stroke {
    public static readonly TK_ERASER = "e";
    public readonly opt: StrokeOption;
    private _points: Point[];

    private idx: number;

    public static parseStrokes(data: Array<any>): Stroke[] {
        const strokes: Stroke[] = [];

        for (const d of data) {
            // 形式はjsonメソッドを参照
            const info = d[0];
            const stroke = new Stroke(info[0], new StrokeOption(info[1], info[2]));
            stroke.parsePoints(d[1]);
            strokes.push(stroke);
        }

        // idxでソート。jsonは順番が保証されない。
        const ret = strokes.sort((a: Stroke, b: Stroke) => {
            return a.isNewer(b);
        });
        return ret;
    }

    public parsePoints(arr: any[]): void {
        this._points = [];
        for (const a of arr) {
            const tmp = new Point(parseInt(a[0]), parseInt(a[1]));
            this._points.push(tmp);
        }
    }

    constructor(idx: number, opt: StrokeOption) {
        this._points = [];
        this.opt = new StrokeOption("", 0);
        this.opt.update(opt);
        this.idx = idx;
    }
    public push(p: Point): void {
        this._points.push(p);
    }
    public get points(): Point[] {
        return this._points;
    }
    public lastPoint(): Point | null {
        if (this._points.length === 0) {
            return null;
        } else {
            return this._points[this._points.length - 1];
        }
    }
    public length(): number {
        return this._points.length;
    }
    public json(): string {
        const ret: string[] = [];
        for (const p of this._points) {
            ret.push(p.json());
        }
        const str:string = `[["${this.idx}","${this.opt.color}","${this.opt.thick}"],[${ret.join(",")}]]`;
        return str;
    }

    public isEraser() {
        const ret = this.opt.color === Stroke.TK_ERASER;
        return ret;
    }
    public isPen() {
        return !this.isEraser();
    }
    public isNewer(stroke: Stroke): number {
        const thisidx = Number.parseInt(this.idx.toString());
        const otheridx = Number.parseInt(stroke.idx.toString());
        if (this.idx > otheridx) {
            return 1;
        } else if (thisidx < otheridx) {
            return -1;
        } else {
            return 0;
        }
    }
}

export class Point {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    public json(): string {
        const ret = `[${this.x},${this.y}]`;
        return ret;
    }
    public isSame(x: number, y: number): boolean {
        const cond1: boolean = x === this.x;
        const cond2: boolean = y === this.y;
        return cond1 && cond2;
    }
}
