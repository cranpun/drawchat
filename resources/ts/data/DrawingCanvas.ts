import { Stroke, Point, StrokeOption } from "./Draw";
import { PenAction } from "../action/PenAction";
import { SaveElement } from "../element/SaveElement";
import * as U from "../u/u";
import { makeCsrfFormData } from "../u/csrf";
import { CanvasElement } from "../element/CanvasElement";
import { ShapeProc } from "../element/shape/ShapeProc";
import { DrawchatWebSocket } from "./DrawchatWebSocket";
import { DrawchatParams } from "../DrawEventHandler";
import { parse, differenceInSeconds } from "date-fns";

export class DrawingCanvas {
    private _stroke: Stroke;
    private _drawingCanvas: CanvasElement;
    private drawnCanvas: CanvasElement;
    private _askPosProc: ShapeProc | null;
    private webSocket: DrawchatWebSocket;
    private params: DrawchatParams;
    private created: Date; // craeted_atの日付オブジェクト。idx生成に利用。

    private static readonly INVALID_IDX: number = -1;

    init(drawingCanvas: CanvasElement, drawnCanvas: CanvasElement, websocket: DrawchatWebSocket, params: DrawchatParams) {
        this._drawingCanvas = drawingCanvas;
        this.drawnCanvas = drawnCanvas;
        this._askPosProc = null;
        this.webSocket = websocket;
        this.params = params;
        this.created = parse(params.created_at, "yyyy-MM-dd HH:mm:ss", new Date());
        this.startStroke();
    }

    get stroke(): Stroke {
        return this._stroke;
    }
    get paper(): CanvasElement {
        return this._drawingCanvas;
    }

    get isAskingPos(): ShapeProc | null {
        return this._askPosProc;
    }
    set isAskingPos(v: ShapeProc | null) {
        this._askPosProc = v;
    }

    public pushPoint(x: number, y: number): void {
        const p = new Point(x, y);
        this._stroke.push(p);
    }

    public lastPoint(): Point | null {
        return this._stroke.lastPoint();
    }

    public startStroke(): void {
        // 次に備えてstrokeをクリア
        // idxはサーバ側で発行するのでダミーデータにすること。
        // endStrokeで上に重ねる形で描画するので、この段階ではidxは参照されない
        const idx = DrawingCanvas.INVALID_IDX;
        this._stroke = new Stroke(idx, this._drawingCanvas.pen.opt);
    }

    public endStroke(): void {
        // Strokeが終わったのでdrawにプッシュ
        if (this._stroke.length() > 0) {
            // 今回のストロークをdrawnにうつす。暫定更新なのでクリアはしない。この1筆だけ渡すことで上に重ねる形になる
            this.drawnCanvas.draw([this.stroke]);
            this.showLabelNosave();
            this.save();
        }
    }
    public async save(): Promise<void> {
        if (!this.isSaved) {
            // drawstoreにデータを格納して再描画。次回更新時に他の人のと合わせて上書きされるので順番等は気にしなくてよい。暫定更新の扱い。
            const json_draw: string = this.stroke.json();

            // websocketで保存
            this.webSocket.send(this.params.ws.cmds.server.get("draw"), json_draw);

            // データをうつしたので描画をクリア
            this._drawingCanvas.clear();
        }
        this.showLabelSaved();
    }

    private get isSaved(): boolean {
        return this._stroke.length() <= 0;
    }

    public async undo(): Promise<void> {
        this.webSocket.send(this.params.ws.cmds.server.get("undo"), "");
    }

    private showLabelNosave() {
        this.updateLabel("not saved", true);
    }
    private showLabelSaved() {
        this.updateLabel("saved", false);
    }

    private updateLabel(label: string, isDanger: boolean) {
        const ele: HTMLElement = <HTMLElement>document.querySelector("#label-save");
        // format(new Date(), 'kk:mm:ss')
        ele.innerText = label;
        if (isDanger) {
            ele.classList.add("has-text-danger");
        } else {
            ele.classList.remove("has-text-danger");
        }
    }
}
