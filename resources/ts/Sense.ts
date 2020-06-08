import { CursorEvent, Point, Tool } from "./types";
import { Paper } from "./Paper";
import { Datastore } from "./Datastore";
import * as U from "./u";
import { MouseHandler } from "./device/MouseHandler";
import { PointerHandler } from "./device/PointerHandler";
import { TouchHandler } from "./device/TouchHandler";
import { SaveAction } from "./action/SaveAction";
import { LoadAction } from "./action/LoadAction";

export class Sense {
    private paper_id: number;
    private wrapdiv: HTMLDivElement;

    private nowproc: boolean; // タッチ、ポインタ等、まとめて複数のイベントを検知した場合に備えて。
    private lastdata: {
        time: number,
        pos: Point,
        timeoutids: number[],
        zoom: number,
        status: CursorEvent,
        tool: Tool
    };

    private mydata: { paper: Paper, datastore: Datastore };
    private otherdata: { paper: Paper, datastore: Datastore };

    private static readonly SEC_SCROLL: number = 0.5 * 1000;
    private static readonly SEC_EXPAND: number = 1.5 * 1000;

    public init(mycnv: HTMLCanvasElement, othercnv: HTMLCanvasElement, wrapdiv: HTMLDivElement): void {
        this.wrapdiv = wrapdiv;
        this.mydata = {
            paper: new Paper(mycnv),
            datastore: new Datastore(),
        }
        this.otherdata = {
            paper: new Paper(othercnv),
            datastore: new Datastore(),
        }
        this.nowproc = false;
        this.lastdata = {
            time: 0,
            pos: null,
            timeoutids: [],
            zoom: 1,
            status: "up",
            tool: null
        };

        new MouseHandler(this).init(mycnv);
        new PointerHandler(this).init(mycnv);
        new TouchHandler(this).init(mycnv);

        // 暫定：ボタンで強制
        new SaveAction(this.mydata.datastore).init();
        new LoadAction(this.otherdata.datastore, this.otherdata.paper).init();
    }

    public proc(st: CursorEvent, e: Event, x: number, y: number) {
        console.log(e.type);

        if (!this.nowproc) {
            this.nowproc = true;
            if (st === "up" && this.lastdata.status !== "up") {
                this.endStroke();
            } else if (st === "down") {
                this.startStroke(x, y);
            } else if (st === "move" && this.lastdata.status === "down") {
                this.setTool();
                // 現在のツールに応じて処理
                if (this.lastdata.tool === "pen") {
                    // 単押し移動＝記述
                    this.mydata.paper.stroke(x, y, this.mydata.datastore.lastPoint());
                    this.mydata.datastore.pushPoint(x, y);
                } else if (this.lastdata.tool === "scroll") {
                    // 長押し移動＝画面スクロール
                    this.scroll(x, y);
                } else if (this.lastdata.tool === "expand") {
                    // さらに長押し＝拡大縮小
                    this.expand(x, y);
                }
            }
            // 処理終了
            this.nowproc = false;
        }
    }

    private endStroke(): void {
        // up -> upの場合は何もしない。down->upのときだけ（moveは設定しないはず）
        this.mydata.datastore.endStroke();
        // 現在の状態を更新
        this.lastdata.status = "up";
        this.lastdata.time = 0;
        this.lastdata.pos = null;

        // 長押しの諸々のキャンセル
        this.clearTimer();
        this.lastdata.tool = null;
    }

    private startStroke(x: number, y: number): void {
        // 操作開始
        this.lastdata.status = "down";
        this.lastdata.tool = null;

        // 長押し確認のために時間を保持
        this.lastdata.pos = new Point(x, y, 0);
        this.startTimer();
    }

    private setTool(): void {

        // toolの判断
        if (this.lastdata.tool === null) {
            // down時のmoveのときのみ操作
            const now: number = Date.now();
            const diff: number = now - this.lastdata.time;
            if (diff < Sense.SEC_SCROLL) {
                // 単押し移動＝記述
                this.lastdata.tool = "pen";
            } else if (diff < Sense.SEC_EXPAND) {
                // 長押し移動＝画面スクロール
                this.lastdata.tool = "scroll";
            } else if (diff >= Sense.SEC_EXPAND) {
                // さらに長押し＝拡大縮小
                this.lastdata.tool = "expand";
            }
            this.clearTimer();
        }
    }
    private scroll(x: number, y: number): void {
        // 差分の計算
        const dx = (x - this.lastdata.pos.x);
        const dy = (y - this.lastdata.pos.y);
        window.scrollBy(dx, dy);
        console.log("scroll", dx, dy);
        // ポイントの更新
        this.lastdata.pos.x = x;
        this.lastdata.pos.y = y;
    }
    private expand(x: number, y: number): void {
        const dy = y - this.lastdata.pos.y;
        this.lastdata.zoom += dy * 0.001; // 移動差分をzoom比率に変換
        this.lastdata.zoom = this.lastdata.zoom < 0.5 ? 0.5 : this.lastdata.zoom;
        const html = document.querySelector("html");
        html.style.transform = `scale(${this.lastdata.zoom})`;
        // ポイントの更新
        this.lastdata.pos.x = x;
        this.lastdata.pos.y = y;
        console.log("expand", dy, this.lastdata.zoom);
    }
    private startTimer(): void {
        // 色を変更
        this.lastdata.time = Date.now();
        this.lastdata.timeoutids.push(window.setTimeout(() => {
            // キャンバスの色を変更
            this.wrapdiv.style.backgroundColor = "#C00";
            this.lastdata.timeoutids.push(window.setTimeout(() => {
                // キャンバスの色を変更
                this.wrapdiv.style.backgroundColor = "#00C";
            }, Sense.SEC_EXPAND));
        }, Sense.SEC_SCROLL));
    }
    private clearTimer(): void {
        // ツールが決定したのでtimeout周りをクリア
        let tid = null;
        while (tid = this.lastdata.timeoutids.pop()) {
            window.clearTimeout(tid);
        }
        this.wrapdiv.style.backgroundColor = "#FFF";
    }
}
