import { DrawEventHandler } from "../DrawEventHandler";
import { PaperElement } from "../element/PaperElement";
import { Point, Coord } from "../u/types";

export class MouseSensor {
    private sense: DrawEventHandler;
    private paper: PaperElement;
    private canvashandlers: ((e: TouchEvent) => void)[] = [];

    public init(sense: DrawEventHandler, paper: PaperElement): void {
        this.sense = sense;
        this.paper = paper;
        this.canvashandlers["mouseup"] = (e: MouseEvent) => this.sense.up("mouse", e, this.p(e));
        this.canvashandlers["mousedown"] = (e: MouseEvent) => this.sense.down("mouse", e, this.p(e));
        this.canvashandlers["mousemove"] = (e: MouseEvent) => this.sense.move("mouse", e, this.p(e));
        this.canvashandlers["mouseleave"] = (e: MouseEvent) => this.sense.up("mouse", e, this.p(e));
        this.addDefaultListener();
    }

    public addDefaultListener() {
        for (const [event, handler] of Object.entries(this.canvashandlers)) {
            this.paper.getCnv().addEventListener(event, handler, { passive: false });
        }
    }

    public removeDefaultListener() {
        for (const [event, handler] of Object.entries(this.canvashandlers)) {
            this.paper.getCnv().removeEventListener(event, handler);
        }
    }
    private p(e: MouseEvent): Coord {
        const x: number = e.offsetX;
        const y: number = e.offsetY;
        return new Coord(x, y);
    }
}
