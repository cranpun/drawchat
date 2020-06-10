import { DrawEvent, Point, Tool, Device } from "./u/types";
import { PaperElement } from "./element/PaperElement";
import { DrawData } from "./data/DrawData";
import * as U from "./u/u";
import { MouseSensor } from "./sensor/MouseSensor";
import { PointerSensor } from "./sensor/PointerSensor";
import { TouchSensor } from "./sensor/TouchSensor";
import { SaveAction } from "./action/SaveAction";
import { LoadAction } from "./action/LoadAction";
import { DrawcanvasesElement } from "./element/DrawcanvasesElement";
import { DrawStatus } from "./data/DrawStatus";
import { LongpressStatus } from "./data/LongpressStatus";
import { PenAction } from "./action/PenAction";
import { RedrawAction } from "./action/RedrawAction";
import { ScrollAction } from "./action/ScrollAction";
import { ZoomAction } from "./action/ZoomAction";

export class DrawEventHandler {
    private paper_id: number;
    private nowproc: Device; // タッチ、ポインタ等、まとめて複数のイベントを検知した場合に備えて。
    private status = {
        draw: new DrawStatus(),
        longpress: new LongpressStatus()
    };
    private element = {
        wrapdiv: new DrawcanvasesElement()
    };
    private action = {
        "pen": new PenAction(),
        "load": new LoadAction(),
        "save": new SaveAction(),
        "redraw": new RedrawAction(),
        "scroll": new ScrollAction(),
        "zoom": new ZoomAction(),
    };

    private mydata = {
        paper: PaperElement.makeMine(),
        datastore: new DrawData(),
    };
    private otherdata = {
        paper: PaperElement.makeOther(),
        datastore: new DrawData(),
    };
    private device = {
        mouse: new MouseSensor(),
        pointer: new PointerSensor(),
        touch: new TouchSensor(),
    }

    public init(): void {

        this.nowproc = null;

        this.device.mouse.init(this, this.mydata.paper);
        this.device.pointer.init(this, this.mydata.paper);
        this.device.touch.init(this, this.mydata.paper);

        this.action.save.init(this.mydata.datastore);
        this.action.load.init(this.otherdata.paper, this.otherdata.datastore, this.action.redraw, this.action.pen);
        this.action.zoom.init(this.element.wrapdiv);
    }
    public proc(st: DrawEvent, dev: Device, e: Event, x: number, y: number) {
        U.tt(`${dev}-${st}(${x},${y})=${this.nowproc}`);
        // 同じ地点のイベントであれば移動していないので無視
        // // upイベントは強制実行
        if (this.status.draw.isEndStroke(st)) {
            this.status.draw.endStroke();
            this.mydata.datastore.endStroke();
            this.element.wrapdiv.setNormal();
            // 1ストローク終わったので終了
            this.status.longpress.end(); // 長押しのまま離す場合もあり。
            this.nowproc = null;
            return;
        }

        if (this.nowproc !== null && this.nowproc !== dev) {
            // 違うデバイスのイベントなので無視
            return;
        }

        if (this.status.draw.isStartStroke(st)) {
            this.nowproc = dev;
            this.status.draw.startStroke();
            this.status.longpress.start(this.element.wrapdiv);
            this.status.longpress.setPoint(x, y, this.action.scroll, this.action.zoom); // 長押し開始地点
        } else if (this.status.draw.isMove(st)) {

            if (this.status.longpress.isSamePoint(x, y)) {
                // do nothing
                return;
            }
            if (this.status.draw.isStartMove(st)) {
                // 長押し時間の判定
                const tool = this.status.longpress.end();
                this.status.draw.setTool(tool);
            }
            // 現在のツールに応じて処理
            switch (this.status.draw.getTool()) {
                case "pen":
                    // 単押し移動＝記述
                    this.action.pen.proc(x, y, this.mydata.datastore.lastPoint(), this.mydata.paper);
                    this.mydata.datastore.pushPoint(x, y);
                    // ここでおしまいなので
                    e.stopPropagation();
                    break;
                case "scroll":
                    // 長押し移動＝画面スクロール
                    this.action.scroll.proc(x, y);
                    break;
                case "zoom":
                    // さらに長押し＝拡大縮小
                    this.action.zoom.proc(x, y);
                    break;
            }
        }
    }

    public down(dev: Device, e: Event, p: Point): void {
        e.preventDefault();
        console.log("down prevent");
        const x: number = p.x;
        const y: number = p.y;
        U.tt(`${dev}-down(${x},${y})=${this.nowproc}`);

        this.nowproc = dev;
        this.status.draw.startStroke();
        this.status.longpress.start(this.element.wrapdiv);
        this.status.longpress.setPoint(x, y, this.action.scroll, this.action.zoom); // 長押し開始地点
    }

    public move(dev: Device, e: Event, p: Point): void {
        e.preventDefault();
        console.log("move prevent");
        const x: number = p.x;
        const y: number = p.y;
        U.tt(`${dev}-move(${x},${y})=${this.nowproc}`);
        if (this.nowproc !== null && this.nowproc !== dev) {
            // 違うデバイスのイベントなので無視
            return;
        }

        if (this.status.longpress.isSamePoint(x, y)) {
            // do nothing
            return;
        }
        if (this.status.draw.isStartMove("move")) {
            // 長押し時間の判定
            const tool = this.status.longpress.end();
            this.status.draw.setTool(tool);
        }
        // 現在のツールに応じて処理
        switch (this.status.draw.getTool()) {
            case "pen":
                // 単押し移動＝記述
                this.action.pen.proc(x, y, this.mydata.datastore.lastPoint(), this.mydata.paper);
                this.mydata.datastore.pushPoint(x, y);
                // ここでおしまいなので
                e.stopPropagation();
                break;
            default:
                // scroll, zoomはこのハンドラでは処理しない
                break;
            // case "scroll":
            //     // 長押し移動＝画面スクロール
            //     this.action.scroll.proc(x, y);
            //     break;
            // case "zoom":
            //     // さらに長押し＝拡大縮小
            //     this.action.zoom.proc(x, y);
            //     break;
        }
    }

    public up(dev: Device, e: Event, p: Point) {
        e.preventDefault();
        const x: number = p.x;
        const y: number = p.y;
        U.tt(`${dev}-up(${x},${y})=${this.nowproc}`);
        this.status.draw.endStroke();
        this.mydata.datastore.endStroke();
        this.element.wrapdiv.setNormal();
        // 1ストローク終わったので終了
        this.status.longpress.end(); // 長押しのまま離す場合もあり。
        this.nowproc = null;
    }

    public movebody(dev: Device, e: Event, p: Point) {
        e.preventDefault();
        const x: number = p.x;
        const y: number = p.y;
        U.tt(`${dev}-movebody(${x},${y})=${this.nowproc}`);
        if (this.nowproc !== null && this.nowproc !== dev) {
            // 違うデバイスのイベントなので無視
            return;
        }

        if (this.status.longpress.isSamePoint(x, y)) {
            // do nothing
            return;
        }
        if (this.status.draw.isStartMove("move")) {
            // 長押し時間の判定
            const tool = this.status.longpress.end();
            this.status.draw.setTool(tool);
        }
        // 現在のツールに応じて処理
        switch (this.status.draw.getTool()) {
            case "scroll":
                // 長押し移動＝画面スクロール
                this.action.scroll.proc(x, y);
                break;
            case "zoom":
                // さらに長押し＝拡大縮小
                this.action.zoom.proc(x, y);
                break;
        }
    }
}
