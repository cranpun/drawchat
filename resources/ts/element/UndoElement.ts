import { Point, Stroke } from "../data/Draw";
import { DrawMine } from "../data/DrawMine";
import { PaperElement } from "../element/PaperElement";
import "../window";
import { PenAction } from "../action/PenAction";

export class UndoElement {
    private ele: HTMLElement;
    private draw: DrawMine;
    private paper: PaperElement;
    private pen: PenAction;
    public init(paper: PaperElement, draw: DrawMine, pen: PenAction) {
        this.paper = paper;
        this.draw = draw;
        this.pen = pen;
        this.ele = document.querySelector("#act-undo");

        this.ele.addEventListener("click", () => this.proc());
    }
    private proc(): void {
        // 最新のstrokeを破棄
        this.draw.getDraw().pop();

        const strokes: Stroke[] = this.draw.getDraw().getStrokes();
        // 現在の記述をクリア、設定を保存
        this.paper.clear();
        this.pen.saveOpt();

        // 改めて描画
        let prepoint: Point = null;
        for (const s of strokes) {
            if (s.isEraser()) {
                this.pen.opt.color = s.color; // 色情報は使わないが念の為設定
                this.pen.opt.eraser = true;
            } else {
                this.pen.opt.color = s.color;
                this.pen.opt.eraser = false;
            }
            for (const p of s.getPoints()) {
                this.pen.proc(p.x, p.y, prepoint, this.paper);
                prepoint = p;
            }
            prepoint = null;
        }

        // 設定を復帰
        this.pen.restoreOpt();
    }
}
