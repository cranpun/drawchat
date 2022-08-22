import { Point, StrokeOption } from "./data/Draw";
import { Device, Tool } from "./u/types";
import { PaperElement } from "./element/PaperElement";
import { DrawMine } from "./data/DrawMine";
import { DrawOther } from "./data/DrawOther";
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
import { ZoomScrollAction } from "./action/ZoomScrollAction";
import { ZoomElement } from "./element/ZoomElement";
import { EraserElement } from "./element/EraserElement";
import { ColorElement } from "./element/ColorElement";
import { ThickElement } from "./element/ThickElement";
import { BackElement } from "./element/BackElement";

export class DrawEventHandler {
    private paper_id: number;
    private nowsensor: Device | null; // タッチ、ポインタ等、まとめて複数のイベントを検知した場合に備えて。
    private status = {
        draw: new DrawStatus(),
    };
    private element = {
        wrapdiv: new DrawcanvasesElement(),
        zoomscroll: new ZoomElement(),
        save: new SaveElement(),
        eraser: new EraserElement(),
        color: new ColorElement(),
        undo: new UndoElement(),
        back: new BackElement(),
        load: new LoadElement(),
        thick: new ThickElement(),
    };
    private action = {
        load: new LoadAction(),
        zoomscroll: new ZoomScrollAction(),
    };

    private mine = {
        paper: PaperElement.makeMine(),
        draw: new DrawMine(),
        pen: new PenAction(),
    };
    private other = {
        paper: PaperElement.makeOther(),
        draw: new DrawOther(),
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

        this.element.zoomscroll.init(this.action.zoomscroll);
        this.element.save.init(this.mine.draw, this.mine.paper);
        this.element.color.init(this.mine.pen);
        this.element.thick.init(this.mine.pen);
        this.element.eraser.init(this.mine.pen);
        this.element.undo.init(this.mine.paper, this.mine.draw, this.mine.pen);
        this.element.back.init(this.mine.draw);
        this.element.load.init(this.action.load);

        this.device.mouse.init(this, this.mine.paper);
        this.device.pointer.init(this, this.mine.paper);
        this.device.touch.init(this, this.mine.paper, this.action.zoomscroll);

        this.action.load.init(this.mine.paper, this.other.paper, this.mine.draw, this.other.draw, this.other.pen, this.status.draw);
        this.action.zoomscroll.init(this.element.wrapdiv, this.element.zoomscroll);

        const strokeopt = new StrokeOption(color, thick);
        this.mine.pen.init(strokeopt);
        this.mine.draw.init(this.mine.pen);

        this.other.pen.init(strokeopt);
    }
    private loadServerData(): any[] {
        const ids: string[] = [
            "#sd-color",
            "#sd-thick",
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
        this.mine.draw.startStroke();
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
                const p: Point | null = this.mine.draw.lastPoint();
                this.mine.pen.proc(x, y, p, this.mine.paper);
                this.mine.draw.pushPoint(x, y);
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
            this.mine.draw.endStroke();
            this.element.wrapdiv.setNormal();
            this.nowsensor = null;
        }
    }
}
