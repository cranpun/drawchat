import { DrawEvent, Point, Tool, Device } from "./u/types";
import { PaperElement } from "./element/PaperElement";
import { DrawData } from "./data/DrawData";
import * as U from "./u/u";
import { MouseSensor } from "./sensor/MouseSensor";
import { PointerSensor } from "./sensor/PointerSensor";
import { TouchSensor } from "./sensor/TouchSensor";
import { SaveElement } from "./element/SaveElement";
import { LoadAction } from "./action/LoadAction";
import { DrawcanvasesElement } from "./element/DrawcanvasesElement";
import { DrawStatus } from "./data/DrawStatus";
import { LongpressStatus } from "./data/LongpressStatus";
import { PenAction } from "./action/PenAction";
import { RedrawAction } from "./action/RedrawAction";
import { ZoomScrollAction } from "./action/ZoomScrollAction";
import { ZoomElement } from "./element/ZoomElement";
import { EraserElement } from "./element/EraserElement";
import { ColorElement } from "./element/ColorElement";

export class DrawEventHandler {
    private paper_id: number;
    private nowsensor: Device; // タッチ、ポインタ等、まとめて複数のイベントを検知した場合に備えて。
    private status = {
        draw: new DrawStatus(),
        longpress: new LongpressStatus()
    };
    private element = {
        wrapdiv: new DrawcanvasesElement(),
        zoomscroll: new ZoomElement(),
        save: new SaveElement(),
        eraser: new EraserElement(),
        color: new ColorElement(),
    };
    private action = {
        "load": new LoadAction(),
        "redraw": new RedrawAction(),
        "zoomscroll": new ZoomScrollAction(),
    };

    private mydata = {
        paper: PaperElement.makeMine(),
        datastore: new DrawData(),
        pen: new PenAction(),
    };
    private otherdata = {
        paper: PaperElement.makeOther(),
        datastore: new DrawData(),
        pen: new PenAction(),
    };
    private device = {
        mouse: new MouseSensor(),
        pointer: new PointerSensor(),
        touch: new TouchSensor(),
    }

    public init(): void {

        this.nowsensor = null;

        const color = ColorElement.defcolor();

        this.element.zoomscroll.init(this.action.zoomscroll);
        this.element.save.init(this.mydata.datastore);
        this.element.color.init(this.mydata.pen, color);
        this.element.eraser.init(this.mydata.pen);

        this.device.mouse.init(this, this.mydata.paper);
        this.device.pointer.init(this, this.mydata.paper);
        this.device.touch.init(this, this.mydata.paper, this.action.zoomscroll);

        this.action.load.init(this.otherdata.paper, this.otherdata.datastore, this.otherdata.pen);
        this.action.zoomscroll.init(this.element.wrapdiv, this.element.zoomscroll);
        this.mydata.pen.init(color);

        this.mydata.datastore.init(this.mydata.pen);
    }

    public down(dev: Device, e: Event, p: Point): void {
        e.preventDefault();
        e.stopPropagation();
        const x: number = p.x;
        const y: number = p.y;
        U.tt(`${dev}-down(${x},${y})=${this.nowsensor}`);

        this.nowsensor = dev;
        this.status.draw.startStroke();
        this.status.longpress.start(this.element.wrapdiv, x, y, this.action.zoomscroll); // 長押し開始地点
    }

    public move(dev: Device, e: Event, p: Point): void {
        e.preventDefault();
        const x: number = p.x;
        const y: number = p.y;
        U.tt(`${dev}-move(${x},${y})=${this.nowsensor}`);

        // 無視する条件
        if (this.nowsensor === null // デバイス未決定なので何もしない
            || this.nowsensor !== dev // 違うデバイスのイベントなので無視
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
                const p = this.mydata.datastore.lastPoint();
                this.mydata.pen.proc(x, y, p, this.mydata.paper);
                const c = this.mydata.pen.color;
                this.mydata.datastore.pushPoint(x, y);
                break;
            case "zoom":
                // さらに長押し＝拡大縮小
                this.action.zoomscroll.zoomdrag(x, y);
                break;
        }
    }

    public up(dev: Device, e: Event, p: Point) {
        const x: number = p.x;
        const y: number = p.y;

        e.preventDefault();
        U.tt(`${dev}-up(${x},${y})=${this.nowsensor}`);

        // 現在のツールに応じて処理
        switch (this.status.draw.getTool()) {
            case "scroll":
                // 長押し移動＝画面スクロール
                this.action.zoomscroll.scroll(x, y);
                break;
        }

        // 1ストローク終わったので終了
        this.status.draw.endStroke();
        this.mydata.datastore.endStroke();
        this.element.wrapdiv.setNormal();
        this.status.longpress.end(); // 長押しのまま離す場合もあり。
        this.nowsensor = null;
    }
}
