import { DrawEventHandler } from "../DrawEventHandler";
import { PaperElement } from "../element/PaperElement";
import { Point, Coord } from "../u/types";
import * as U from "../u/u";
import { ZoomScrollAction } from "../action/ZoomScrollAction";
export class TouchSensor {
    private sense: DrawEventHandler;
    private paper: PaperElement;
    private zoomscroll: ZoomScrollAction;
    private canvashandlers: ((e: TouchEvent) => void)[] = [];

    public init(sense: DrawEventHandler, paper: PaperElement, zoomscroll: ZoomScrollAction): void {
        this.sense = sense;
        this.paper = paper;
        this.zoomscroll = zoomscroll;
        this.canvashandlers["touchend"] = (e: TouchEvent) => this.sense.up("touch", e, this.p(e));
        this.canvashandlers["touchstart"] = (e: TouchEvent) => this.sense.down("touch", e, this.p(e));
        this.canvashandlers["touchmove"] = (e: TouchEvent) => this.sense.move("touch", e, this.p(e));
        this.canvashandlers["touchleave"] = (e: TouchEvent) => this.sense.up("touch", e, this.p(e));
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
    
    private p(e: TouchEvent): Coord {
        const ct = e.changedTouches[0]
        const bc = (<HTMLCanvasElement>e.target).getBoundingClientRect();
        const x = ct.clientX - bc.left;
        const y = ct.clientY - bc.top;
        return new Coord(x / this.zoomscroll.getZoom(), y / this.zoomscroll.getZoom());
    }
}
