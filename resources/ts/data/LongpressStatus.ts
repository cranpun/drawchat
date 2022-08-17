import { Point } from "../data/Draw";
import { Tool } from "../u/types";
import { DrawcanvasesElement } from "../element/DrawcanvasesElement";
import { ZoomScrollAction } from "../action/ZoomScrollAction";
import * as U from "../u/u";

export class LongpressStatus {
    private time: number;
    private timeoutids: number[] = []; // 配列だけは初期化
    private pos: Point | null;

    private static readonly SEC_SCROLL: number = 0.2 * 1000;
    private static readonly SEC_EXPAND: number = 1.0 * 1000;

    constructor() {
        this.clear();
    }

    private clear() {
        // 次回に向けて初期化
        this.time = 0;
        this.pos = null;
        // ツールが決定したのでtimeout周りをクリア
        let tid: number | null = null;
        while (tid = <number>this.timeoutids.pop()) {
            window.clearTimeout(tid);
        }
    }

    public end(): Tool | null {
        if (this.isStart() === false) {
            // スタートしていないので何もしない
            return null;
        }
        // U.pd("end press!!!");

        // モードの判定
        const now: number = Date.now();
        const diff: number = now - this.time;
        this.clear();
        if (diff < LongpressStatus.SEC_SCROLL) {
            // 単押し移動＝記述
            return "pen";
        } else if (diff < LongpressStatus.SEC_EXPAND) {
            // 長押し移動＝画面スクロール
            return "scroll";
        } else if (diff >= LongpressStatus.SEC_EXPAND) {
            // さらに長押し＝拡大縮小
            return "zoom";
        } else {
            // デフォルトはnull
            return null;
        }
    }

    public start(wrapdiv: DrawcanvasesElement, x: number, y: number, zoomscroll: ZoomScrollAction): void {
        if (this.isStart()) {
            // 既に開始しているので何もしない
            return;
        }
        // U.pd("start press...");
        // 長押しの位置確認
        this.time = Date.now();

        this.pos = new Point(x, y);
        zoomscroll.setPoint(x, y);

        // // 色を変更
        // this.timeoutids.push(window.setTimeout(() => {
        //     // キャンバスの色を変更
        //     wrapdiv.setScroll();
        //     this.timeoutids.push(window.setTimeout(() => {
        //         // キャンバスの色を変更
        //         wrapdiv.setExpand();
        //     }, LongpressStatus.SEC_EXPAND));
        // }, LongpressStatus.SEC_SCROLL));
    }

    public isSamePoint(x: number, y: number) {
        if (this.pos === null) {
            // 前の点がないので同じではない
            return false;
        }
        const ret = this.pos.isSame(x, y);
        return ret;
    }

    public isStart() {
        return this.timeoutids.length > 0;
    }
}