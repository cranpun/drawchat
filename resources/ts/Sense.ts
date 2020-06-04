import { DeviceType, EventStatus, Point, Tool } from "./types";
import { Paper } from "./Paper";
import { Datastore } from "./Datastore";
import * as U from "./u";

export class Sense {
    private room_id: number;
    private wrapdiv: HTMLDivElement;
    private nowdevice: DeviceType;
    private nowstatus: EventStatus;
    private nowtool: Tool;
    private mydata: { paper: Paper, datastore: Datastore };
    private otherdata: { paper: Paper, datastore: Datastore };
    private lastdata: { time: number, pos: Point, timeoutid: number, zoom: number };

    private static readonly SEC_SCROLL: number = 1 * 1000;
    private static readonly SEC_EXPAND: number = 2 * 1000;

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
        this.nowdevice = null;
        this.nowstatus = "up"; // 初期は離した状態
        this.nowtool = null;
        this.lastdata = {
            time: 0,
            pos: null,
            timeoutid: null,
            zoom: 1
        };


        // this.cnv.addEventListener("
        mycnv.addEventListener("mouseup", (e: MouseEvent) => this.mousehandler(e), false);
        mycnv.addEventListener("mousedown", (e: MouseEvent) => this.mousehandler(e), false);
        mycnv.addEventListener("mousemove", (e: MouseEvent) => this.mousehandler(e), false);
        mycnv.addEventListener("mouseleave", (e: MouseEvent) => this.mousehandler(e), false);

        mycnv.addEventListener("pointerup", (e: PointerEvent) => this.pointerhandler(e), false);
        mycnv.addEventListener("pointerdown", (e: PointerEvent) => this.pointerhandler(e), false);
        mycnv.addEventListener("pointermove", (e: PointerEvent) => this.pointerhandler(e), false);
        mycnv.addEventListener("pointerleave", (e: PointerEvent) => this.pointerhandler(e), false);

        mycnv.addEventListener("touchstart", (e: TouchEvent) => this.touchhandler(e), false);
        mycnv.addEventListener("touchleave", (e: TouchEvent) => this.touchhandler(e), false);
        mycnv.addEventListener("touchmove", (e: TouchEvent) => this.touchhandler(e), false);
        mycnv.addEventListener("touchend", (e: TouchEvent) => this.touchhandler(e), false);

        // 暫定：ボタンで強制
        const bt_save = document.querySelector("#bt-save");
        bt_save.addEventListener("click", (e: MouseEvent) => this.save());
        // const bt_load = document.querySelector("#bt-load");
        // bt_load.addEventListener("click", (e: MouseEvent) => this.load());
        this.comm()
    }

    private proc(st: EventStatus, e: Event, x: number, y: number) {
        console.log(e.type);

        if (st === "up" && this.nowstatus !== "up") {
            // up -> upの場合は何もしない。down->upのときだけ（moveは設定しないはず）
            this.mydata.datastore.endStroke();
            // 現在の状態を更新
            this.nowstatus = "up";
            this.lastdata.time = 0;
            this.lastdata.pos = null;

            // 長押しの諸々のキャンセル
            window.clearTimeout(this.lastdata.timeoutid);
            this.wrapdiv.style.backgroundColor = "#FFF";
            this.nowtool = null;
        } else if (st === "down") {
            // 操作開始
            this.nowstatus = "down";

            // 長押し確認のために時間を保持
            this.lastdata.time = Date.now();
            this.lastdata.pos = new Point(x, y, 0);

            // 色を変更
            this.lastdata.timeoutid = window.setTimeout(() => {
                // キャンバスの色を変更
                this.wrapdiv.style.backgroundColor = "#CCC";
                this.lastdata.timeoutid = window.setTimeout(() => {
                    // キャンバスの色を変更
                    this.wrapdiv.style.backgroundColor = "#AAA";
                }, Sense.SEC_EXPAND);
            }, Sense.SEC_SCROLL);
        } else if (st === "move" && this.nowstatus === "down") {
            // down時のmoveのときのみ操作
            const now: number = Date.now();
            const diff: number = now - this.lastdata.time;
            // toolの判断
            if (this.nowtool === null) {
                if (diff < Sense.SEC_SCROLL) {
                    // 単押し移動＝記述
                    this.nowtool = "pen";
                } else if (diff < Sense.SEC_EXPAND) {
                    // 長押し移動＝画面スクロール
                    this.nowtool = "scroll";
                } else if (diff >= Sense.SEC_EXPAND) {
                    // さらに長押し＝拡大縮小
                    this.nowtool = "expand";
                }
                window.clearTimeout(this.lastdata.timeoutid);
            }

            // 現在のツールに応じて処理
            if (this.nowtool === "pen") {
                // 単押し移動＝記述
                this.mydata.paper.stroke(x, y, this.mydata.datastore.lastPoint());
                this.mydata.datastore.pushPoint(x, y);
            } else if (this.nowtool === "scroll") {
                // 長押し移動＝画面スクロール
                this.scroll(x, y);
            } else if (this.nowtool === "expand") {
                // さらに長押し＝拡大縮小
                this.expand(x, y);
            }
        }
    }

    private mousehandler(e: MouseEvent): void {
        // タッチが先に検知されるので優先する。
        if (["touch", "pointer"].indexOf(this.nowdevice) < 0) {
            e.preventDefault();
            this.nowdevice = "mouse";
            const x: number = e.offsetX;
            const y: number = e.offsetY;

            let prepos: EventStatus = this.nowstatus;

            // 位置の更新
            if (e.type === "mouseup") {
                this.proc("up", e, x, y);
            } else if (e.type === "mousedown") {
                this.proc("down", e, x, y);
            } else if (e.type === "mouseleave") {
                // 設置したまま外に出た場合は離したとみなす。
                this.proc("up", e, x, y);
            } else if (e.type === "mousemove") {
                this.proc("move", e, x, y);
            }

        }
        // 一通りのイベント検知が終わったのでdeviceをnullに。
        // 次に、マウスイベントが拾えるように。
        this.nowdevice = null;
    };

    private touchhandler(e: TouchEvent): void {
        e.preventDefault();
        this.nowdevice = "touch";
        // x,yの取得
        const ct = e.changedTouches[0]
        const bc = (<HTMLCanvasElement>e.target).getBoundingClientRect();
        const x = ct.clientX - bc.left;
        const y = ct.clientY - bc.top;

        if (e.type == "touchend") {
            this.proc("up", e, x, y);
        } else if (e.type == "touchstart") {
            this.proc("down", e, x, y);
        } else if (e.type == "touchleave") {
            // 領域の外に出たら終了
            this.proc("up", e, x, y);
        } else if (e.type === "touchmove") {
            this.proc("move", e, x, y);
        }
    };

    private pointerhandler(e: PointerEvent): void {
        // タッチが先に検知されるので優先する。
        if (this.nowdevice !== "touch") {
            e.preventDefault();
            this.nowdevice = "pointer";
            const x: number = e.offsetX;
            const y: number = e.offsetY;

            // 位置の更新
            if (e.type === "pointerup") {
                this.proc("up", e, x, y);
            } else if (e.type === "pointerdown") {
                this.proc("down", e, x, y);
            } else if (e.type === "pointerleave") {
                // 設置したまま外に出た場合は離したとみなす。
                this.proc("up", e, x, y);
            } else if (e.type === "pointermove") {
                this.proc("move", e, x, y);
            }
        }
    }
    private async comm(): Promise<void> {
        await this.load();
        // await this.save();
        setTimeout(() => this.comm(), 7 * 1000);
    }
    private async save(): Promise<void> {
        U.tt("now saving...", true);
        await this.mydata.datastore.save();
        U.tt("saved", true);
    }
    private async load(): Promise<void> {
        U.tt("now loading...", false);
        await this.otherdata.datastore.load();
        await this.otherdata.paper.redraw(this.otherdata.datastore.getDesc());
        U.tt("loaded", true);
    }
    private scroll(x: number, y: number) {
        // 差分の計算
        const dx = (x - this.lastdata.pos.x);
        const dy = (y - this.lastdata.pos.y);
        window.scrollBy(dx, dy);
        console.log("scroll", dx, dy);
        // ポイントの更新
        this.lastdata.pos.x = x;
        this.lastdata.pos.y = y;
    }
    private expand(x: number, y: number) {
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
}
