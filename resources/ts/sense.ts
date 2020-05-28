export class Sense {
    private cnv: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private nowdevice: DeviceType;
    private nowpos: EventStatus;

    public init(): void {
        this.cnv = document.querySelector("#drawcanvas");
        this.ctx = this.cnv.getContext("2d");

        // this.cnv.addEventListener("
        this.cnv.addEventListener("mouseup", this.mousehandler, false);
        this.cnv.addEventListener("mousedown", this.mousehandler, false);
        this.cnv.addEventListener("mousemove", this.mousehandler, false);
        this.cnv.addEventListener("mouseleave", this.mousehandler, false);

        this.cnv.addEventListener("pointerup", this.pointerhandler);
        this.cnv.addEventListener("pointerdown", this.pointerhandler);
        this.cnv.addEventListener("pointermove", this.pointerhandler);
        this.cnv.addEventListener("pointerleave", this.pointerhandler);

        this.cnv.addEventListener("touchstart", this.touchhandler);
        this.cnv.addEventListener("touchleave", this.touchhandler);
        this.cnv.addEventListener("touchmove", this.touchhandler);
        this.cnv.addEventListener("touchend", this.touchhandler);
    }

    private mousehandler(e: MouseEvent): void {
        // タッチが先に検知されるので優先する。
        if (["touch", "pointer"].indexOf(this.nowdevice) < 0) {
            this.nowdevice = "mouse";
            const x: number = e.offsetX;
            const y: number = e.offsetY;

            let prepos: EventStatus = this.nowpos;

            // 位置の更新
            if (e.type === "mouseup") {
                this.nowpos = "up";
            } else if (e.type === "mousedown") {
                this.nowpos = "down";
            } else if (e.type === "mouseleave") {
                // 設置したまま外に出た場合は離したとみなす。
                this.nowpos = "up"
            }

            // 現在の位置に従って描画
            if (this.nowpos === "down") {
                // me.paper.actionDrawStart(x, y);
            } else {
                // me.paper.actionDrawEnd();
            }

            // // 記述が途切れたのでキャンバスサイズを調整。
            // // 前回記述で、今回離した場合。
            // if (prepos == "down" && me.nowpos == "up") {
            //     me.expandCanvas_(xy.y);
            // }
            console.log(this.nowdevice, x, y, this.nowpos);
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
            this.nowpos = "up";
        } else if (e.type == "touchstart") {
            this.nowpos = "down";
        } else if (e.type == "touchleave") {
            // 領域の外に出たら終了
            this.nowpos = "up"
        }

        // 現在の位置に従って描画
        if (this.nowpos == "down") {
            // this.paper.actionDrawStart(xy.x, xy.y);
        } else {
            // this.paper.actionDrawEnd();
        }

        // // 記述が途切れたのでキャンバスサイズを調整。
        // // 前回記述で、今回離した場合。
        // if (prepos == "down" && me.nowpos == "up") {
        //     me.expandCanvas_(xy.y);
        // }
        console.log(this.nowdevice, x, y, this.nowpos);
    };

    private pointerhandler(e: PointerEvent): void {
        // タッチが先に検知されるので優先する。
        if (this.nowdevice != "touch") {
            this.nowdevice = "pointer";
            const x: number = e.offsetX;
            const y: number = e.offsetY;
            console.log("mouse", x, y);
            let prepos: EventStatus = this.nowpos;

            // 位置の更新
            if (e.type == "pointerup") {
                this.nowpos = "up";
            } else if (e.type == "pointerdown") {
                this.nowpos = "down";
            } else if (e.type == "pointerleave") {
                // 設置したまま外に出た場合は離したとみなす。
                this.nowpos = "up"
            }

            // 現在の位置に従って描画
            if (this.nowpos == "down") {
                // this.paper.actionDrawStart(xy.x, xy.y);
            } else {
                // this.paper.actionDrawEnd();
            }
            console.log(this.nowdevice, x, y, this.nowpos);

            // 一通りのイベント検知が終わったのでdeviceをnullに。
            // 次に、マウスイベントが拾えるように。
            // me.nowdevice = null;
        }
    }
}

type EventStatus = "up" | "down";
type DeviceType = "mouse" | "touch" | "pointer";

