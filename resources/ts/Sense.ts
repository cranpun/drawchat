import { DeviceType, EventStatus } from "./types";
import { Paper } from "./Paper";
import { Datastore } from "./Datastore";
const Swal = require("sweetalert2");

export class Sense {
    private cnv: HTMLCanvasElement;
    private nowdevice: DeviceType;
    private nowstatus: EventStatus;
    private paper: Paper;
    private datastore: Datastore;

    public init(sel_canvas: string, sel_save: string, sel_load: string): void {
        this.cnv = document.querySelector(sel_canvas);
        this.paper = new Paper(this.cnv);
        this.datastore = new Datastore();
        this.nowdevice = null;
        this.nowstatus = "up"; // 初期は離した状態

        // this.cnv.addEventListener("
        this.cnv.addEventListener("mouseup", (e: MouseEvent) => this.mousehandler(e), false);
        this.cnv.addEventListener("mousedown", (e: MouseEvent) => this.mousehandler(e), false);
        this.cnv.addEventListener("mousemove", (e: MouseEvent) => this.mousehandler(e), false);
        this.cnv.addEventListener("mouseleave", (e: MouseEvent) => this.mousehandler(e), false);

        this.cnv.addEventListener("pointerup", (e: PointerEvent) => this.pointerhandler(e), false);
        this.cnv.addEventListener("pointerdown", (e: PointerEvent) => this.pointerhandler(e), false);
        this.cnv.addEventListener("pointermove", (e: PointerEvent) => this.pointerhandler(e), false);
        this.cnv.addEventListener("pointerleave", (e: PointerEvent) => this.pointerhandler(e), false);

        this.cnv.addEventListener("touchstart", (e: TouchEvent) => this.touchhandler(e), false);
        this.cnv.addEventListener("touchleave", (e: TouchEvent) => this.touchhandler(e), false);
        this.cnv.addEventListener("touchmove", (e: TouchEvent) => this.touchhandler(e), false);
        this.cnv.addEventListener("touchend", (e: TouchEvent) => this.touchhandler(e), false);

        const bt_save = document.querySelector(sel_save);
        bt_save.addEventListener("click", (e: MouseEvent) => this.save());
        const bt_load = document.querySelector(sel_load);
        bt_load.addEventListener("click", (e: MouseEvent) => this.load());
        // setInterval(async () => {
        //     this.load()
        // }, 3 * 1000);
    }

    private proc(st: EventStatus, x: number, y: number) {
        if (st === "up" && this.nowstatus !== "up") {
            // up -> upの場合は何もしない
            this.datastore.endStroke();
        } else if (st === "down") {
            this.paper.stroke(x, y, this.datastore.lastPoint());
            this.datastore.pushPoint(x, y);
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
    private async save(): Promise<void> {
        Swal.fire({
            text: "now saving...",
            toast: true,
            position: "bottom-start",
            timer: 3 * 1000,
            showConfirmButton: false
        });
        await this.datastore.save();
        Swal.fire({
            text: "saved",
            toast: true,
            position: "bottom-start",
            timer: 3 * 1000,
            showConfirmButton: false
        });
    }
    private async load(): Promise<void> {
        Swal.fire({
            text: "now loading...",
            toast: true,
            position: "bottom-end",
            timer: 3 * 1000,
            showConfirmButton: false
        });
        await this.datastore.load();
        await this.paper.redraw(this.datastore.getDesc());
        Swal.fire({
            text: "loaded",
            toast: true,
            position: "bottom-end",
            timer: 3 * 1000,
            showConfirmButton: false
        });
    }
}
