import { Point } from "../../data/Draw";
import { DrawingCanvas } from "../../data/DrawingCanvas";
import * as U from "../../u/u";


export abstract class ShapeProc {
    protected abstract proc(draw: DrawingCanvas, p: Point | null): void;

    async exec(draw: DrawingCanvas, p: Point | null = null): Promise<void> {
        await this.proc(draw, p);
    }

    protected startAskPos(draw: DrawingCanvas, mes: string = "書き込む場所をタッチしてください"): void {
        U.toast.normal(mes);
        draw.isAskingPos = this;
    }

    public endAskPos(draw: DrawingCanvas, p: Point): void {
        draw.isAskingPos = null;
        this.exec(draw, p);
    }
}