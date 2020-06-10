import { DrawData } from "../data/DrawData";
import * as U from "../u/u";
import { PaperElement } from "../element/PaperElement";
import { Draw, Stroke, Point } from "../u/types";
import { PenAction } from "./PenAction";

export class RedrawAction {
    public proc(paper: PaperElement, datastore: DrawData, pen: PenAction): void {
        const strokes: Stroke[] = datastore.getDraw().getStrokes();
        let prepoint: Point = null;
        for (const s of strokes) {
            for (const p of s.getPoints()) {
                pen.proc(p.x, p.y, prepoint, paper); 
                prepoint = p;
            }
            prepoint = null;
        }
    }
}
