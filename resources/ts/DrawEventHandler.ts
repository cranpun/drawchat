import { Point, StrokeOption } from "./data/Draw";
import { Device, Tool } from "./u/types";
import { DrawingCanvas } from "./data/DrawingCanvas";
import * as U from "./u/u";
import { MouseSensor } from "./sensor/MouseSensor";
import { PointerSensor } from "./sensor/PointerSensor";
import { TouchSensor } from "./sensor/TouchSensor";
import { SaveElement } from "./element/SaveElement";
import { DrawcanvasesElement } from "./element/DrawcanvasesElement";
import { DrawStatus } from "./data/DrawStatus";
import { UndoElement } from "./element/UndoElement";
import { ZoomElement } from "./element/ZoomElement";
import { ColorElement } from "./element/ColorElement";
import { ThickElement } from "./element/ThickElement";
import { BackElement } from "./element/BackElement";
import { DownloadElement } from "./element/DownloadElement";
import { ShapeElement } from "./element/ShapeElement";
import { DrawchatWebSocket } from "./data/DrawchatWebSocket";
import { CanvasElement } from "./element/CanvasElement";
import { LinkElement } from "./element/LinkElement";
import { InfoCanvas } from "./data/InfoCanvas";
import { PaperbgElement } from "./element/PaperbgElement";

export type DrawchatWSParams = {
    url: string,
    token: string,
    cmds: {
        server: Map<string, string>,
        client: Map<string, string>,
    }
}
export type DrawchatParams = {
    user_id: number,
    width: number,
    height: number,
    csrf_token: string,
    created_at: string,
    color: string,
    thick: number,
    paper_id: number,
    ws: DrawchatWSParams,
    consts: Map<string, string>
}

export class DrawEventHandler {
    private nowsensor: Device | null; // タッチ、ポインタ等、まとめて複数のイベントを検知した場合に備えて。
    private status = {
        draw: new DrawStatus(),
    };
    private element = {
        wrapdiv: new DrawcanvasesElement(),
        zoom: new ZoomElement(),
        save: new SaveElement(),
        color: new ColorElement(),
        undo: new UndoElement(),
        back: new BackElement(),
        thick: new ThickElement(),
        download: new DownloadElement(),
        shape: new ShapeElement(),
        link: new LinkElement(),
        paperbg: new PaperbgElement(),
    };
    private params: DrawchatParams;

    private drawing: DrawingCanvas = new DrawingCanvas();
    private info: InfoCanvas = new InfoCanvas();

    private drawingCanvas: CanvasElement;
    private drawnCanvas: CanvasElement;
    private infoCanvas: CanvasElement;

    private websocket: DrawchatWebSocket = new DrawchatWebSocket();
    private device = {
        mouse: new MouseSensor(),
        pointer: new PointerSensor(),
        touch: new TouchSensor(),
    }

    public init(params: DrawchatParams): void {
        this.params = params;
        this.nowsensor = null;

        const strokeopt = new StrokeOption(params.color, params.thick);
        this.drawingCanvas = CanvasElement.makeDrawing(strokeopt);
        this.drawnCanvas = CanvasElement.makeDrawstore(strokeopt);
        this.infoCanvas = CanvasElement.makeInfo(strokeopt);

        this.drawing.init(this.drawingCanvas, this.drawnCanvas, this.websocket, params);
        this.info.init(this.infoCanvas, this.websocket, params);

        this.element.zoom.init();
        this.element.save.init(this.drawing, this.drawing.paper);
        this.element.color.init(this.drawing.paper.pen);
        this.element.thick.init(this.drawing.paper.pen);
        this.element.undo.init(this.drawing);
        this.element.back.init(this.drawing);
        this.element.download.init(this.drawingCanvas, this.drawnCanvas, params.width, params.height, params.created_at);
        this.element.shape.init(this.drawing, params.width, params.height);
        this.element.link.init();
        this.element.paperbg.init(this.websocket, params.ws.cmds.server.get("paperbg"));

        this.device.mouse.init(this, this.drawing.paper);
        this.device.pointer.init(this, this.drawing.paper);
        this.device.touch.init(this, this.drawing.paper, this.element.zoom);

        // 準備完了。通信開始。
        this.websocket.init(params, this.drawnCanvas, this.info, this.element.link);
    }

    public down(dev: Device, e: Event, p: Point): void {
        e.preventDefault();
        e.stopPropagation();

        // positionAsk状態であれば何もしない
        if (this.drawing.isAskingPos) {
            return;
        }

        const x: number = p.x;
        const y: number = p.y;
        if (this.status.draw.getTool() === "shape") {
            // shapeの場合、現在位置をShapeProcに送る

        } else {

            // U.pd(`${dev}-down(${x},${y})=${this.nowsensor}`);

            this.nowsensor = dev;
            if (!this.drawing.isAskingPos) {
                this.status.draw.startStroke();
                this.drawing.startStroke();
            }
        }
    }

    public move(dev: Device, e: Event, p: Point): void {
        this.movePosProc(p);
        // positionAsk状態であれば何もしない
        if (this.drawing.isAskingPos) {
            return;
        }

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
                this.drawing.paper.pen.proc(x, y, p, this.drawing.paper);
                this.drawing.pushPoint(x, y);
                break;
        }
    }

    private movePosProc(p: Point): void {
        // infoCanvas更新
        this.info.update(this.params.user_id, p, this.drawingCanvas.pen.opt);
        this.info.clear();
        this.info.draw();

        // サーバに送信。このまま他の人にも送信してwebsocketで解析するのでフィールド名を合わせること
        const pack = {
            user_id: this.params.user_id,
            pos: p,
            opt: this.drawingCanvas.pen.opt
        }
        const json = JSON.stringify(pack);
        this.websocket.send(this.params.ws.cmds.server.get("pos"), json);
    }

    public up(dev: Device, e: Event, p: Point) {

        e.preventDefault();
        // U.pd(`${dev}-up(${x},${y})=${this.nowsensor}`);

        // askPos状態であればそれを実行
        if (this.drawing.isAskingPos) {
            this.drawing.isAskingPos.endAskPos(this.drawing, p);
        } else {

            // 1ストローク終わったので終了
            if (this.status.draw.isDrawing()) {
                this.status.draw.endStroke();
                this.drawing.endStroke();
                this.element.wrapdiv.setNormal();
                this.nowsensor = null;
            }
        }
    }
}
