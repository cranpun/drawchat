import { DrawEventHandler } from "../DrawEventHandler";
import { PaperElement } from "../element/PaperElement";
import { Point } from "../data/Draw";

export class PointerSensor {
    private sense: DrawEventHandler;
    private paper: PaperElement;
    private canvashandlers: ((e: TouchEvent) => void)[] = [];

    public init(sense: DrawEventHandler, paper: PaperElement): void {
        this.sense = sense;
        this.paper = paper;
        this.canvashandlers["pointerup"] = (e: PointerEvent) => this.sense.up("pointer", e, this.p(e));
        this.canvashandlers["pointerdown"] = (e: PointerEvent) => this.sense.down("pointer", e, this.p(e));
        this.canvashandlers["pointermove"] = (e: PointerEvent) => this.sense.move("pointer", e, this.p(e));
        this.canvashandlers["pointerleave"] = (e: PointerEvent) => this.sense.up("pointer", e, this.p(e));
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

    private p(e): Point {
        const x: number = e.offsetX;
        const y: number = e.offsetY;
        return new Point(x, y);
    }
}
