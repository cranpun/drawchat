export class Draw {
    private user_id: number;
    private s: Stroke[];
    constructor() {
        this.clear();
    }
    public push(p: Stroke): void {
        this.s.push(p);
    }
    public pop(): Stroke | null {
        const ret: Stroke | null = this.s.pop();
        return ret;
    }
    public peek(): Stroke | null {
        const ret: Stroke | null = this.s.length > 0 ? this.s[this.s.length - 1] : null;
        return ret;
    }
    public clear(): void {
        this.s = [];
    }
    public getStrokes(): Stroke[] {
        return this.s;
    }
    public lastStrokes(): Stroke | null {
        if (this.s.length === 0) {
            return null
        } else {
            return this.s[this.s.length - 1];
        }
    }
    public json(): string {
        const ret: string[] = [];
        for (const p of this.s) {
            ret.push(p.json());
        }
        return `[${ret.join(",")}]`;
    }
    public parse(strokes: any[]): void {
        this.s = [];
        for (const s of strokes) {
            const opt:StrokeOption = new StrokeOption(s[0][0], s[0][1]);
            const tmp = new Stroke(opt);
            tmp.parse(s[1]);
            this.s.push(tmp);
        }
    }
    public length(): number {
        return this.s.length;
    }
}

export class StrokeOption {
    public color: string; // 消しゴムの場合はeのみ
    public thick: number;

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
    private p: Point[];
    constructor(opt: StrokeOption) {
        this.p = [];
        this.opt = new StrokeOption("", 0);
        this.opt.update(opt);
    }
    public push(p: Point): void {
        this.p.push(p);
    }
    public getPoints(): Point[] {
        return this.p;
    }
    public lastPoint(): Point | null {
        if (this.p.length === 0) {
            return null;
        } else {
            return this.p[this.p.length - 1];
        }
    }
    public clear(): void {
        this.p = [];
    }
    public length(): number {
        return this.p.length;
    }
    public json(): string {
        const ret: string[] = [];
        for (const p of this.p) {
            ret.push(p.json());
        }
        return `[["${this.opt.color}","${this.opt.thick}"],[${ret.join(",")}]]`;
    }
    public parse(arr: any[]): void {
        this.p = [];
        for (const a of arr) {

            const tmp = new Point(parseInt(a[0]), parseInt(a[1]));
            this.p.push(tmp);
        }
    }
    public isEraser() {
        const ret = this.opt.color === Stroke.TK_ERASER;
        return ret;
    }
    public isPen() {
        return !this.isEraser();
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
