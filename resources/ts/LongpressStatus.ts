import { Point, Tool } from "./types";
import { WrapdivElement } from "./element/WrapdivElement";
import { ScrollAction } from "./action/ScrollAction";
import { ExpandAction } from "./action/ExpandAction";

export class LongpressStatus {
    private time: number;
    private timeoutids: number[] = []; // 配列だけは初期化
    private pos: Point;

    private static readonly SEC_SCROLL: number = 0.5 * 1000;
    private static readonly SEC_EXPAND: number = 1.5 * 1000;

    constructor() {
        this.clear();
    }

    private clear() {
        // 次回に向けて初期化
        this.time = 0;
        this.pos = null;
        // ツールが決定したのでtimeout周りをクリア
        let tid = null;
        while (tid = this.timeoutids.pop()) {
            window.clearTimeout(tid);
        }
    }

    public end(): Tool {

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
            return "expand";
        } else {
            // デフォルトはnull
            return null;
        }
    }

    public start(wrapdiv: WrapdivElement): void {
        // 長押しの位置確認
        this.time = Date.now();

        // 色を変更
        this.timeoutids.push(window.setTimeout(() => {
            // キャンバスの色を変更
            wrapdiv.setScroll();
            this.timeoutids.push(window.setTimeout(() => {
                // キャンバスの色を変更
                wrapdiv.setExpand();
            }, LongpressStatus.SEC_EXPAND));
        }, LongpressStatus.SEC_SCROLL));
    }

    public setPoint(x: number, y: number, scroll: ScrollAction, expand: ExpandAction) {
        this.pos = new Point(x, y, 0);
        expand.setPoint(x, y);
        scroll.setPoint(x, y);
    }
}