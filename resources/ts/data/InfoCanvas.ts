import { Stroke, Point, StrokeOption } from "./Draw";
import { PenAction } from "../action/PenAction";
import { SaveElement } from "../element/SaveElement";
import * as U from "../u/u";
import { makeCsrfFormData } from "../u/csrf";
import { CanvasElement } from "../element/CanvasElement";
import { ShapeProc } from "../element/shape/ShapeProc";
import { DrawchatWebSocket } from "./DrawchatWebSocket";
import { DrawchatParams } from "../DrawEventHandler";
import { parse, differenceInSeconds } from "date-fns";

class PointInfo {
    point: Point;
    opt: StrokeOption;

    constructor(point: Point, opt: StrokeOption) {
        this.point = point;
        this.opt = opt;
    }
}

export class InfoCanvas {
    private webSocket: DrawchatWebSocket;
    private params: DrawchatParams;
    private infoCanvas: CanvasElement;
    private points: Map<number, PointInfo>


    public init(infoCanvas: CanvasElement, websocket: DrawchatWebSocket, params: DrawchatParams) {
        this.webSocket = websocket;
        this.params = params;
        this.infoCanvas = infoCanvas;
        this.points = new Map();
    }

    public update(user_id: number, point: Point, opt: StrokeOption): void {
        this.delete(user_id);
        this.points.set(user_id, new PointInfo(point, opt));
    }

    public delete(user_id: number): void {
        this.points.delete(user_id);
    }

    public draw(): void {
        const ctx: CanvasRenderingContext2D = this.infoCanvas.getCtx();
        this.points.forEach((pointInfo, user_id) => {
            ctx.beginPath();
            const half: number = pointInfo.opt.thick / 2;
            ctx.strokeStyle = pointInfo.opt.color;
            ctx.arc(pointInfo.point.x, pointInfo.point.y, half, 0, 2 * Math.PI);
            ctx.stroke();
        });
    }
    public clear(): void {
        this.infoCanvas.clear();
    }

}
