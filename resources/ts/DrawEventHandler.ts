import { Point, StrokeOption } from "./data/Draw";
import { Device, Tool } from "./u/types";
import { PaperElement } from "./element/PaperElement";
import { Drawing } from "./data/Drawing";
import { Drawstore } from "./data/Drawstore";
import * as U from "./u/u";
import { MouseSensor } from "./sensor/MouseSensor";
import { PointerSensor } from "./sensor/PointerSensor";
import { TouchSensor } from "./sensor/TouchSensor";
import { SaveElement } from "./element/SaveElement";
import { LoadAction } from "./action/LoadAction";
import { LoadElement } from "./element/LoadElement";
import { DrawcanvasesElement } from "./element/DrawcanvasesElement";
import { DrawStatus } from "./data/DrawStatus";
import { PenAction } from "./action/PenAction";
import { UndoElement } from "./element/UndoElement";
import { ZoomElement } from "./element/ZoomElement";
import { EraserElement } from "./element/EraserElement";
import { ColorElement } from "./element/ColorElement";
import { ThickElement } from "./element/ThickElement";
import { BackElement } from "./element/BackElement";
import { DownloadElement } from "./element/DownloadElement";

export class DrawEventHandler {
    private paper_id: number;
    private nowsensor: Device | null; // タッチ、ポインタ等、まとめて複数のイベントを検知した場合に備えて。
    private status = {
        draw: new DrawStatus(),
    };
    private element = {
        wrapdiv: new DrawcanvasesElement(),
        zoom: new ZoomElement(),
        save: new SaveElement(),
        eraser: new EraserElement(),
        color: new ColorElement(),
        undo: new UndoElement(),
        back: new BackElement(),
        load: new LoadElement(),
        thick: new ThickElement(),
        download: new DownloadElement(),
    };
    private action = {
        load: new LoadAction(),
    };

    private drawing = {
        paper: PaperElement.makeMine(),
        drawing: new Drawing(),
        pen: new PenAction(),
    };
    private drawstore = {
        paper: PaperElement.makeOther(),
        drawstore: new Drawstore(),
        pen: new PenAction(),
    };
    private device = {
        mouse: new MouseSensor(),
        pointer: new PointerSensor(),
        touch: new TouchSensor(),
    }

    public init(): void {

        this.nowsensor = null;

        const sd = this.loadServerData();
        const color = sd["#sd-color"];
        const thick = sd["#sd-thick"];

        this.element.zoom.init();
        this.element.save.init(this.drawing.drawing, this.drawing.paper);
        this.element.color.init(this.drawing.pen);
        this.element.thick.init(this.drawing.pen);
        this.element.eraser.init(this.drawing.pen);
        this.element.undo.init(this.drawing.paper, this.drawing.drawing, this.drawing.pen);
        this.element.back.init(this.drawing.drawing);
        this.element.load.init(this.action.load);
        this.element.download.init(this.drawing.paper, this.drawstore.paper, sd["#sd-cw"], sd["#sd-ch"], sd["#sd-created_at"]);

        this.device.mouse.init(this, this.drawing.paper);
        this.device.pointer.init(this, this.drawing.paper);
        this.device.touch.init(this, this.drawing.paper, this.element.zoom);

        this.action.load.init(this.drawing.paper, this.drawstore.paper, this.drawing.drawing, this.drawstore.drawstore, this.drawstore.pen, this.status.draw);

        const strokeopt = new StrokeOption(color, thick);
        this.drawing.pen.init(strokeopt);
        this.drawing.drawing.init(this.drawing.pen, this.drawstore.drawstore);

        this.drawstore.pen.init(strokeopt);
    }
    private loadServerData(): any[] {
        const ids: string[] = [
            "#sd-color",
            "#sd-thick",
            "#sd-cw",
            "#sd-ch",
            "#sd-created_at",
        ];
        const ret = [];
        for (const id of ids) {
            ret[id] = document.querySelector(id)?.innerHTML;
        }
        return ret;
    }

    public down(dev: Device, e: Event, p: Point): void {
        e.preventDefault();
        e.stopPropagation();
        const x: number = p.x;
        const y: number = p.y;
        // U.pd(`${dev}-down(${x},${y})=${this.nowsensor}`);

        this.nowsensor = dev;
        this.status.draw.startStroke();
        this.drawing.drawing.startStroke();
    }

    public move(dev: Device, e: Event, p: Point): void {
        e.preventDefault();
        const x: number = p.x;
        const y: number = p.y;
        // U.pd(`${dev}-move(${x},${y})=${this.nowsensor}`);

        // 無視する条件
        if (this.nowsensor === null // デバイス未決定なので何もしない
            || this.nowsensor !== dev // 違うデバイスのイベントなので無視
            // 動いていないので何もしない
        ) {
            // do nothing
            return;
        }

        this.status.draw.setTool("pen");

        // 現在のツールに応じて処理
        switch (this.status.draw.getTool()) {
            case "pen":
                // 単押し移動＝記述
                const p: Point | null = this.drawing.drawing.lastPoint();
                this.drawing.pen.proc(x, y, p, this.drawing.paper);
                this.drawing.drawing.pushPoint(x, y);
                break;
        }
    }

    public up(dev: Device, e: Event, p: Point) {

        e.preventDefault();
        // U.pd(`${dev}-up(${x},${y})=${this.nowsensor}`);

        // 1ストローク終わったので終了
        if (this.status.draw.isDrawing()) {
            const x: number = p.x;
            const y: number = p.y;
            this.status.draw.endStroke();
            this.drawing.drawing.endStroke();
            this.element.wrapdiv.setNormal();
            this.nowsensor = null;
        }
    }
}
