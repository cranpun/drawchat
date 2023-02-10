import { Draw, Point, StrokeOption } from "./data/Draw";
import { Device, Tool } from "./u/types";
import { PaperElement } from "./element/PaperElement";
import { Drawing } from "./data/Drawing";
import { Drawstore } from "./data/Drawstore";
import * as U from "./u/u";
import { MouseSensor } from "./sensor/MouseSensor";
import { PointerSensor } from "./sensor/PointerSensor";
import { TouchSensor } from "./sensor/TouchSensor";
import { SaveElement } from "./element/SaveElement";
import { DrawcanvasesElement } from "./element/DrawcanvasesElement";
import { DrawStatus } from "./data/DrawStatus";
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
        thick: new ThickElement(),
        download: new DownloadElement(),
    };
    private drawing: Drawing;
    private drawstore: Drawstore;
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
        const strokeopt = new StrokeOption(color, thick);
        this.drawstore = new Drawstore(strokeopt);
        this.drawing = new Drawing(strokeopt, this.drawstore);

        this.element.zoom.init();
        this.element.save.init(this.drawing, this.drawing.getPaper());
        this.element.color.init(this.drawing.getPaper().getPen());
        this.element.thick.init(this.drawing.getPaper().getPen());
        this.element.eraser.init(this.drawing.getPaper().getPen());
        this.element.undo.init(this.drawing.getPaper(), this.drawing, this.drawing.getPaper().getPen());
        this.element.back.init(this.drawing);
        this.element.download.init(this.drawing.getPaper(), this.drawstore.getPaper(), sd["#sd-cw"], sd["#sd-ch"], sd["#sd-created_at"]);

        this.device.mouse.init(this, this.drawing.getPaper());
        this.device.pointer.init(this, this.drawing.getPaper());
        this.device.touch.init(this, this.drawing.getPaper(), this.element.zoom);

        // 自動起動
        this.drawstore.autoload();
        this.drawing.autosave();
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
        this.drawing.startStroke();
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
                const p: Point | null = this.drawing.lastPoint();
                this.drawing.getPaper().getPen().proc(x, y, p, this.drawing.getPaper());
                this.drawing.pushPoint(x, y);
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
            this.drawing.endStroke();
            this.element.wrapdiv.setNormal();
            this.nowsensor = null;
        }
    }
}
