import { DrawData } from "../data/DrawData";
import * as U from "../u/u";
import { Point } from "../u/types";
import { DrawcanvasesElement } from "../element/DrawcanvasesElement";
import { ZoomElement } from "../element/ZoomElement";

export class ZoomScrollAction {
    private wrapdiv: DrawcanvasesElement;
    private zoomscroll: ZoomElement;
    private prep: Point = null;
    private nowzoom: number = 1;
    private orgw: number = 0;
    private orgh: number = 0;

    private readonly ZOOM_MAX: number = 2;
    private readonly ZOOM_MIN: number = 0.5;

    public init(wrapdiv: DrawcanvasesElement, zoomscroll: ZoomElement) {
        this.wrapdiv = wrapdiv;
        this.zoomscroll = zoomscroll;
        this.nowzoom = 1;
        this.zoomscroll.show(this.nowzoom);
        const ele: HTMLElement = document.querySelector("main");
        this.orgw = parseInt(ele.style.width.replace("px",""));
        this.orgh = parseInt(ele.style.height.replace("px",""));
    }
    public setPoint(x: number, y: number) {
        this.prep = new Point(x, y, 0);
    }
    public scroll(x: number, y: number): void {
        if(this.ignore()) {
            return;
        }
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
        // 移動差分をzoom比率に変換。現在の比率によって差分量を調整（大きいと大きい）
        this.nowzoom += dy * 0.0005 * this.nowzoom;
        // 範囲補正
        this.nowzoom = Math.min(Math.max(this.nowzoom, this.ZOOM_MIN), this.ZOOM_MAX);
        // const ele: HTMLDivElement = this.wrapdiv.element();
        const ele: HTMLElement = document.querySelector("main");
        ele.style.transform = `scale(${this.nowzoom})`;
        // ポイントの更新
        this.prep.x = x;
        this.prep.y = y;
        // console.log("expand", dy, this.nowzoom);
        this.zoomscroll.show(this.nowzoom);
        ele.style.width =`${this.orgw * this.nowzoom}px`;
        ele.style.height =`${this.orgh * this.nowzoom}px`;

        // // bodyの大きさを追随
        // const body: HTMLElement = document.querySelector("body");
        // // 大きさはscale前のものが取得されるのでzoomで計算
        // body.style.width = `${parseInt(ele.style.width.replace("px", "")) * this.nowzoom}px`;
        // // 高さはtoolboxの分を取得
        // body.style.height = `${(parseInt(ele.style.height.replace("px", "")) * this.nowzoom) + 55}px`;
    }
    public getZoom(): number {
        return this.nowzoom;
    }

    private pretime: number = 0;
    private ignore() {
        const n:number = Date.now();
        let ret = true;
        if(n - this.pretime > 0.01 * 1000) {
            ret = false;
            this.pretime = n;
        }
        return ret;
    }
}
