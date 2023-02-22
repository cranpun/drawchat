import { DrawEventHandler } from "../DrawEventHandler";
import { CanvasElement } from "../element/CanvasElement";
import { Point } from "../data/Draw";

export class MouseSensor {
    private sense: DrawEventHandler;
    private paper: CanvasElement;
    private canvashandlers: ((e: TouchEvent) => void)[] = [];

    public init(sense: DrawEventHandler, paper: CanvasElement): void {
        this.sense = sense;
        this.paper = paper;
        this.canvashandlers["mouseup"] = (e: MouseEvent) => this.sense.up("mouse", e, this.p(e));
        this.canvashandlers["mousedown"] = (e: MouseEvent) => this.sense.down("mouse", e, this.p(e));
        this.canvashandlers["mousemove"] = (e: MouseEvent) => this.sense.move("mouse", e, this.p(e));
        this.canvashandlers["mouseleave"] = (e: MouseEvent) => this.sense.up("mouse", e, this.p(e));
        this.addDefaultListener();
    }

    public addDefaultListener(): void {
        for (const [event, handler] of Object.entries(this.canvashandlers)) {
            this.paper.getCnv().addEventListener(event, handler, { passive: false });
        }
    }

    public removeDefaultListener(): void {
        for (const [event, handler] of Object.entries(this.canvashandlers)) {
            this.paper.getCnv().removeEventListener(event, handler);
        }
    }
    private p(e: MouseEvent): Point {
        const x: number = e.offsetX;
        const y: number = e.offsetY;
        return new Point(x, y);
    }
}
