import { Datastore } from "../Datastore";
import * as U from "../u";
import { Paper } from "../Paper";
import { Point } from "../types";

export class PenAction {
    public proc(x: number, y: number, prep: Point, paper: Paper): void {
        let pre = prep;
        if (pre == null) {
            // 前回の点がなければ今回の点
            pre = new Point(x, y, 0);
        }
        const ctx = paper.getCtx();
        ctx.save()
        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        ctx.moveTo(pre.x, pre.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();
    }
}
