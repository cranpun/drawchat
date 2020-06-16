import { Point, Stroke } from "../data/Draw";
import { DrawMine } from "../data/DrawMine";
import { PaperElement } from "../element/PaperElement";
import "../window";
import { PenAction } from "./PenAction";

export class RedrawAction {
    public async proc(paper: PaperElement, datastore: DrawMine, pen: PenAction): Promise<void> {
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
