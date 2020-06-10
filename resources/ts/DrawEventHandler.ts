import { DrawEvent, Point, Tool } from "./u/types";
import { PaperElement } from "./element/PaperElement";
import { DrawData } from "./data/DrawData";
import * as U from "./u/u";
import { MouseSensor } from "./sensor/MouseSensor";
import { PointerSensor } from "./sensor/PointerSensor";
import { TouchSensor } from "./sensor/TouchSensor";
import { SaveAction } from "./action/SaveAction";
import { LoadAction } from "./action/LoadAction";
import { WrapdivElement } from "./element/WrapdivElement";
import { DrawStatus } from "./data/DrawStatus";
import { LongpressStatus } from "./data/LongpressStatus";
import { PenAction } from "./action/PenAction";
import { RedrawAction } from "./action/RedrawAction";
import { ScrollAction } from "./action/ScrollAction";
import { ExpandAction } from "./action/ExpandAction";

export class DrawEventHandler {
    private paper_id: number;
    private nowproc: boolean; // タッチ、ポインタ等、まとめて複数のイベントを検知した場合に備えて。
    private status = {
        draw: new DrawStatus(),
        longpress: new LongpressStatus()
    };
    private element = {
        wrapdiv: new WrapdivElement()
    };
    private action = {
        "pen": new PenAction(),
        "load": new LoadAction(),
        "save": new SaveAction(),
        "redraw": new RedrawAction(),
        "scroll": new ScrollAction(),
        "expand": new ExpandAction(),
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

        this.nowproc = false;

        this.device.mouse.init(this, this.mydata.paper);
        this.device.pointer.init(this, this.mydata.paper);
        this.device.touch.init(this, this.mydata.paper);

        this.action.save.init(this.mydata.datastore);
        this.action.load.init(this.otherdata.paper, this.otherdata.datastore, this.action.redraw, this.action.pen);
        this.action.expand.init(this.element.wrapdiv);
    }

    public proc(st: DrawEvent, e: Event, x: number, y: number) {
        console.log(e.type);

        if (!this.nowproc) {
            this.nowproc = true;
            if (this.status.draw.isEndStroke(st)) {
                this.status.draw.endStroke();
                this.mydata.datastore.endStroke();
                this.element.wrapdiv.setNormal();
            } else if (this.status.draw.isStartStroke(st)) {
                this.status.draw.startStroke();
                this.status.longpress.start(this.element.wrapdiv);
                this.status.longpress.setPoint(x, y, this.action.scroll, this.action.expand); // 長押し開始地点
            } else if (this.status.draw.isMove(st)) {
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
                        break;
                    case "scroll":
                        // 長押し移動＝画面スクロール
                        this.action.scroll.proc(x, y);
                        break;
                    case "expand":
                        // さらに長押し＝拡大縮小
                        this.action.expand.proc(x, y);
                        break;
                }
            }
            // 処理終了
            this.nowproc = false;
        }
    }
}
