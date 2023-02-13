import { Point } from "../../data/Draw";
import { Drawing } from "../../data/Drawing";
import * as U from "../../u/u";


export abstract class ShapeProc {
    protected abstract proc(draw: Drawing, p: Point | null): void;

    async exec(draw: Drawing, p: Point | null = null): Promise<void> {
        await this.proc(draw, p);
    }

    protected startAskPos(draw: Drawing, mes: string = "書き込む場所をタッチしてください"): void {
        U.toast.normal(mes);
        draw.isAskingPos = this;
    }

    public endAskPos(draw: Drawing, p: Point): void {
        draw.isAskingPos = null;
        this.exec(draw, p);
        draw.showLabelNosave();
    }
}