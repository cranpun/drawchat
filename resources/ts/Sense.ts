import { DeviceType, EventStatus } from "./types";
import { Paper } from "./Paper";
import { Datastore } from "./Datastore";
import * as U from "./u";

export class Sense {
    private room_id: number;
    private nowdevice: DeviceType;
    private nowstatus: EventStatus;
    private mydata: {paper: Paper, datastore: Datastore};
    private otherdata: {paper: Paper, datastore: Datastore};

    public init(mycnv: HTMLCanvasElement, othercnv: HTMLCanvasElement): void {
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

    private proc(st: EventStatus, x: number, y: number) {
        if (st === "up" && this.nowstatus !== "up") {
            // up -> upの場合は何もしない
            this.mydata.datastore.endStroke();
        } else if (st === "down") {
            this.mydata.paper.stroke(x, y, this.mydata.datastore.lastPoint());
            this.mydata.datastore.pushPoint(x, y);
        }
        // 現在の状態を更新
        this.nowstatus = st;

        // // 記述が途切れたのでキャンバスサイズを調整。
        // // 前回記述で、今回離した場合。
        // if (prepos == "down" && me.nowstatus == "up") {
        //     me.expandCanvas_(xy.y);
        // }
        // console.log(this.nowdevice, x, y, this.nowstatus);

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
                this.proc("up", x, y);
            } else if (e.type === "mousedown") {
                this.proc("down", x, y);
            } else if (e.type === "mouseleave") {
                // 設置したまま外に出た場合は離したとみなす。
                this.proc("up", x, y);
            } else if (e.type === "pointermove") {
                this.proc(this.nowstatus, x, y);
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
            this.proc("up", x, y);
        } else if (e.type == "touchstart") {
            this.proc("down", x, y);
        } else if (e.type == "touchleave") {
            // 領域の外に出たら終了
            this.proc("up", x, y);
        } else if (e.type === "pointermove") {
            this.proc(this.nowstatus, x, y);
        }
    };

    private pointerhandler(e: PointerEvent): void {
        // タッチが先に検知されるので優先する。
        if (this.nowdevice !== "touch") {
            e.preventDefault();
            this.nowdevice = "pointer";
            const x: number = e.offsetX;
            const y: number = e.offsetY;
            let prepos: EventStatus = this.nowstatus;

            // 位置の更新
            if (e.type === "pointerup") {
                this.proc("up", x, y);
            } else if (e.type === "pointerdown") {
                this.proc("down", x, y);
            } else if (e.type === "pointerleave") {
                // 設置したまま外に出た場合は離したとみなす。
                this.proc("up", x, y);
            } else if (e.type === "pointermove") {
                this.proc(this.nowstatus, x, y);
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
        U.tt("now loading...", true);
        await this.otherdata.datastore.load();
        await this.otherdata.paper.redraw(this.otherdata.datastore.getDesc());
        U.tt("loaded", true);
    }
}
