import { DrawData } from "../data/DrawData";
import * as U from "../u/u";
import { DrawcanvasesElement } from "../element/DrawcanvasesElement";
import { Point } from "../u/types";

export class ZoomAction {
    private wrapdiv: DrawcanvasesElement;
    private prep: Point = null;
    private zoom: number = 1;

    public init(wrapdiv: DrawcanvasesElement) {
        this.wrapdiv = wrapdiv;
    }
    public setPoint(x: number, y: number) {
        this.prep = new Point(x, y, 0);
    }

    public proc(x: number, y: number): void {
        const dy = this.prep.y - y;
        // 移動差分をzoom比率に変換
        this.zoom += dy * 0.002;
        // 範囲補正
        this.zoom = Math.max(this.zoom, 0.5);
        const ele: HTMLDivElement = this.wrapdiv.element();
        ele.style.transform = `scale(${this.zoom})`;
        // ポイントの更新
        this.prep.x = x;
        this.prep.y = y;
        console.log("expand", dy, this.zoom);
    }
}
