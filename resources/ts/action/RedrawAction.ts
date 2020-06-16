import { DrawData } from "../data/DrawData";
import * as U from "../u/u";
import { PaperElement } from "../element/PaperElement";
import { Draw, Stroke, Point } from "../data/Draw";
import { PenAction } from "./PenAction";
import { ColorElement } from "../element/ColorElement";
import "../window";

export class RedrawAction {
    public async proc(paper: PaperElement, datastore: DrawData, pen: PenAction): Promise<void> {
        const strokes: Stroke[] = datastore.getDraw().getStrokes();

        let prepoint: Point = null;
        for (const s of strokes) {
            if (s.isEraser()) {
                pen.color = s.color; // 色情報は使わないが念の為設定
                pen.eraser = true;
            } else {
                pen.color = s.color;
                pen.eraser = false;
            }
            for (const p of s.getPoints()) {
                pen.proc(p.x, p.y, prepoint, paper);
                prepoint = p;
            }
            prepoint = null;
        }
    }
}
