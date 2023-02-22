import { Tool } from "../u/types";

// export class Draw {
//     private user_id: number;
//     private s: Stroke[];
//     public idx: number;

//     constructor() {
//         this.clear();
//     }
//     public setIDs(id: number, user_id: number): void {
//         this.user_id = user_id;
//         this.idx = id;
//     }
//     public push(p: Stroke): void {
//         this.s.push(p);
//     }
//     public pop(): Stroke | undefined {
//         const ret: Stroke | undefined = this.s.pop();
//         return ret;
//     }
//     public peek(): Stroke | null {
//         const ret: Stroke | null = this.s.length > 0 ? this.s[this.s.length - 1] : null;
//         return ret;
//     }
//     public clear(): void {
//         this.s = [];
//     }
//     public getStrokes(): Stroke[] {
//         return this.s;
//     }
//     public lastStrokes(): Stroke | null {
//         if (this.s.length === 0) {
//             return null
//         } else {
//             return this.s[this.s.length - 1];
//         }
//     }
//     public json(): string {
//         const ret: string[] = [];
//         for (const p of this.s) {
//             ret.push(p.json());
//         }
//         return `[${ret.join(",")}]`;
//     }
//     public parse(strokes: any[]): void {
//         this.s = [];
//         for (const s of strokes) {
//             const opt: StrokeOption = new StrokeOption(s[0][0], s[0][1]);
//             const tmp = new Stroke(opt);
//             tmp.parsePoints(s[1]);
//             this.s.push(tmp);
//         }
//     }
//     public length(): number {
//         return this.s.length;
//     }

//     public isOlder(draw: Draw): number {
//         if (this.idx > draw.idx) {
//             return -1;
//         } else if (this.idx < draw.idx) {
//             return 1;
//         } else {
//             return 0;
//         }
//     }

//     public isNewer(draw: Draw): number {
//         if (this.idx > draw.idx) {
//             return 1;
//         } else if (this.idx < draw.idx) {
//             return -1;
//         } else {
//             return 0;
//         }
//     }
// }

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

    public static parseStrokes(text: string): Stroke[] {
        const strokes: Stroke[] = [];

        for (const d of JSON.parse(text)) {
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
        if (this.idx > stroke.idx) {
            return 1;
        } else if (this.idx < stroke.idx) {
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
