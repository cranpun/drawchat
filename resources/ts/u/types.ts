export type DrawEvent = "up" | "down" | "move";
export type Tool = "pen" | "scroll" | "expand";

export class Draw {
    private s: Stroke[];
    constructor() {
        this.s = [];
    }
    public push(p: Stroke): void {
        this.s.push(p);
    }
    public getStrokes(): Stroke[] {
        return this.s;
    }
    public lastStrokes(): Stroke | null {
        if(this.s.length === 0) {
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
            const tmp = new Stroke();
            tmp.parse(s);
            this.s.push(tmp);
        }
    }
}
export class Stroke {
    private p: Point[];
    constructor() {
        this.p = [];
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
        return `[${ret.join(",")}]`;
    }
    public parse(arr: any[]): void {
        this.p = [];
        for (const a of arr) {
            const tmp = new Point(parseInt(a[0]), parseInt(a[1]), parseInt(a[2]));
            this.p.push(tmp);
        }
    }
}

export class Point {
    public x: number;
    public y: number;
    public t: number;
    constructor(x: number, y: number, t: number) {
        this.x = x;
        this.y = y;
        this.t = t;
    }
    public json(): string {
        const ret = `[${this.x},${this.y},${this.t}]`;
        return ret;
    }
}
