import { DrawData } from "../data/DrawData";
import * as U from "../u/u";
import { Point } from "../u/types";
import { DrawcanvasesElement } from "../element/DrawcanvasesElement";

export class ZoomScrollAction {
    private wrapdiv: DrawcanvasesElement;
    private prep: Point = null;
    private nowzoom: number = 1;

    public init(wrapdiv: DrawcanvasesElement) {
        this.wrapdiv = wrapdiv;
        this.nowzoom = 1;
    }
    public setPoint(x: number, y: number) {
        this.prep = new Point(x, y, 0);
    }
    public scroll(x: number, y: number): void {
        // 差分の計算
        const dx = (this.prep.x - x) * this.nowzoom;
        const dy = (this.prep.y - y) * this.nowzoom;
        window.scrollBy(dx, dy);
        console.log("scroll", `${this.prep.x}-${x}=${dx}, ${this.prep.y}-${y}=${dy}`);
        // ポイントの更新
        this.prep.x = x;
        this.prep.y = y;
    }
    public zoom(x: number, y: number): void {
        const dy = this.prep.y - y;
        // 移動差分をzoom比率に変換
        this.nowzoom += dy * 0.002;
        // 範囲補正
        this.nowzoom = Math.max(this.nowzoom, 0.3);
        const ele: HTMLDivElement = this.wrapdiv.element();
        ele.style.transform = `scale(${this.nowzoom})`;
        // ポイントの更新
        this.prep.x = x;
        this.prep.y = y;
        console.log("expand", dy, this.nowzoom);
    }
    public getZoom(): number {
        return this.nowzoom;
    }
}
