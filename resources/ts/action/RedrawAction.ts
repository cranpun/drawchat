import { Datastore } from "../Datastore";
import * as U from "../u";
import { Paper } from "../Paper";
import { Draw, Stroke, Point } from "../types";
import { PenAction } from "./PenAction";

export class RedrawAction {
    public proc(paper: Paper, datastore: Datastore, pen: PenAction): void {
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
