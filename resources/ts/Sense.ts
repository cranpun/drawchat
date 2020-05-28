import { DeviceType, EventStatus } from "./types";
import { Paper } from "./Paper";

export class Sense {
    private cnv: HTMLCanvasElement;
    private nowdevice: DeviceType;
    private nowstatus: EventStatus;
    private paper: Paper;

    public init(selector: string): void {
        this.cnv = document.querySelector(selector);
        this.paper = new Paper(this.cnv);
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
    }

    private proc(st: EventStatus, x: number, y: number) {
        // 現在の位置に従って描画
        this.nowstatus = st;
        if (this.nowstatus === "up") {
            this.paper.endStroke();
        } else {
            this.paper.stroke(x, y);
        }

        // // 記述が途切れたのでキャンバスサイズを調整。
        // // 前回記述で、今回離した場合。
        // if (prepos == "down" && me.nowstatus == "up") {
        //     me.expandCanvas_(xy.y);
        // }
        console.log(this.nowdevice, x, y, this.nowstatus);

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
            } else if ( e.type === "pointermove") {
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
        } else if ( e.type === "pointermove") {
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
            console.log(e.type);

            // 位置の更新
            if (e.type === "pointerup") {
                this.proc("up", x, y);
            } else if (e.type === "pointerdown") {
                this.proc("down", x, y);
            } else if (e.type === "pointerleave") {
                // 設置したまま外に出た場合は離したとみなす。
                this.proc("up", x, y);
            } else if ( e.type === "pointermove") {
                this.proc(this.nowstatus, x, y);
            }
        }
    }
}
