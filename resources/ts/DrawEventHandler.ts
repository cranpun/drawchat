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
import { ZoomScrollAction } from "./action/ZoomScrollAction";

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
        "zoomscroll": new ZoomScrollAction(),
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
        this.device.touch.init(this, this.mydata.paper, this.action.zoomscroll);

        this.action.save.init(this.mydata.datastore);
        this.action.load.init(this.otherdata.paper, this.otherdata.datastore, this.action.redraw, this.action.pen);
        this.action.zoomscroll.init(this.element.wrapdiv);
    }

    public down(dev: Device, e: Event, p: Point): void {
        e.preventDefault();
        e.stopPropagation();
        const x: number = p.x;
        const y: number = p.y;
        U.tt(`${dev}-down(${x},${y})=${this.nowproc}`);

        this.nowproc = dev;
        this.status.draw.startStroke();
        this.status.longpress.start(this.element.wrapdiv, x, y, this.action.zoomscroll); // 長押し開始地点
    }

    public move(dev: Device, e: Event, p: Point): void {
        e.preventDefault();
        const x: number = p.x;
        const y: number = p.y;
        U.tt(`${dev}-move(${x},${y})=${this.nowproc}`);

        // 無視する条件
        if (this.nowproc === null // デバイス未決定なので何もしない
            || this.nowproc !== dev // 違うデバイスのイベントなので無視
            || this.status.longpress.isSamePoint(x, y) // 動いていないので何もしない
        ) {
            // do nothing
            return;
        }


        if (this.status.longpress.isStart()) {
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
                // ここでおしまい。bodyには伝えない。
                e.stopPropagation();
                break;
            default:
                // scroll, zoomはこのハンドラでは処理しない
                break;
        }
    }

    public up(dev: Device, e: Event, p: Point) {
        const x: number = p.x;
        const y: number = p.y;
        e.preventDefault();
        e.stopPropagation();
        U.tt(`${dev}-up(${x},${y})=${this.nowproc}`);
        this.status.draw.endStroke();
        this.mydata.datastore.endStroke();
        this.element.wrapdiv.setNormal();
        // 1ストローク終わったので終了
        this.status.longpress.end(); // 長押しのまま離す場合もあり。
        this.nowproc = null;
    }

    public downbody(dev: Device, e: Event, p: Point) {
        e.preventDefault();
        e.stopPropagation();
        const x: number = p.x;
        const y: number = p.y;
        U.tt(`${dev}-downdown(${x},${y})=${this.nowproc}`);

        this.nowproc = dev;
        this.status.longpress.start(this.element.wrapdiv, x, y, this.action.zoomscroll); // 長押し開始地点
    }

    public movebody(dev: Device, e: Event, p: Point) {
        const x: number = p.x;
        const y: number = p.y;
        e.preventDefault();
        e.stopPropagation();
        U.tt(`${dev}-movebody(${x},${y})=${this.nowproc}`);

        // 無視する条件
        if (this.nowproc === null // デバイス未決定なので何もしない
            || this.nowproc !== dev // 違うデバイスのイベントなので無視
            || this.status.longpress.isSamePoint(x, y) // 動いていないので何もしない
        ) {
            // do nothing
            return;
        }

        // 正しく動いたのでツール確認
        if (this.status.longpress.isStart()) {
            // 長押しから動いたので秒数を計測して判定
            const tool = this.status.longpress.end();
            this.status.draw.setTool(tool);
        }
        // 現在のツールに応じて処理
        switch (this.status.draw.getTool()) {
            case "scroll":
                // 長押し移動＝画面スクロール
                this.action.zoomscroll.scroll(x, y);
                break;
            case "zoom":
                // さらに長押し＝拡大縮小
                this.action.zoomscroll.zoom(x, y);
                break;
        }
    }

    public upbody(dev: Device, e: Event, p: Point) {
        const x: number = p.x;
        const y: number = p.y;
        e.preventDefault();
        e.stopPropagation();
        U.tt(`${dev}-bodyup(${x},${y})=${this.nowproc}`);
        this.status.draw.endStroke();
        this.element.wrapdiv.setNormal();
        // 1ストローク終わったので終了
        this.status.longpress.end(); // 長押しのまま離す場合もあり。
        this.nowproc = null;
    }
}
