import { Point, Stroke } from "../data/Draw";
import { Drawing } from "../data/Drawing";
import { PaperElement } from "../element/PaperElement";
import { PenAction } from "../action/PenAction";

export class UndoElement {
    private ele: HTMLElement;
    private draw: Drawing;
    private paper: PaperElement;
    private pen: PenAction;
    public init(paper: PaperElement, draw: Drawing, pen: PenAction) {
        this.paper = paper;
        this.draw = draw;
        this.pen = pen;
        this.ele = <HTMLElement>document.querySelector("#act-undo");

        this.ele.addEventListener("click", () => this.proc());
        this.ele.addEventListener("touchend", () => this.proc());
    }
    private proc(): void {
        // 最新のstrokeを破棄して、その内容を取得
        const strokes: Stroke[] = this.draw.undo();
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
