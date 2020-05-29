export type EventStatus = "up" | "down";
export type DeviceType = "mouse" | "touch" | "pointer";

export class Desc {
    private strokes: Stroke[];
    constructor() {
        this.strokes = [];
    }
    public push(p: Stroke): void {
        this.strokes.push(p);
    }
    public getStrokes(): Stroke[] {
        return this.strokes;
    }
}
export class Stroke {
    private points: Point[];
    constructor() {
        this.points = [];
    }
    public push(p: Point): void {
        this.points.push(p);
    }
    public getPoints(): Point[] {
        return this.points;
    }
    public lastPoint(): Point | null{
        if(this.points.length === 0) {
            return null;
        } else {
            return this.points[this.points.length - 1];
        }
    }
    public clear(): void {
        this.points.length = 0;
    }
    public length(): number {
        return this.points.length;
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
}
