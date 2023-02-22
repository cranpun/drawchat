import { DrawingCanvas } from "../data/DrawingCanvas";
import * as U from "../u/u";
import { CanvasElement } from "./CanvasElement";
import { parse, format } from "date-fns";


export class DownloadElement {

    private ele: HTMLElement;
    private paperdrawing: CanvasElement;
    private paperdrawstore: CanvasElement;
    private cw: number;
    private ch: number;
    private filename: string;

    constructor() {
        this.ele = <HTMLElement>document.querySelector("#act-download");
        this.ele.addEventListener("click", async () => { await this.proc() });
        this.ele.addEventListener("touchend", async () => { await this.proc() });
    }
    public init(paperdrawing: CanvasElement, paperdrawstore: CanvasElement, cw: number, ch: number, created_at: string) {
        this.paperdrawing = paperdrawing;
        this.paperdrawstore = paperdrawstore;
        this.cw = cw;
        this.ch = ch;
        const dtlabel = format(parse(created_at, "yyyy-MM-dd kk:mm:ss", new Date()), "yyyy-MM-dd_kk-mm");
        this.filename = `drawchat-${dtlabel}.png`;

        // メニューに名前を表示
        document.querySelector("#label-download").textContent = this.filename;
    }
    private async proc(): Promise<void> {
        // drawingを画像化
        const drawingimg: HTMLImageElement = await U.toImage(this.paperdrawing.getCnv());

        // drawstoreを画像化
        const drawstoreimg: HTMLImageElement = await U.toImage(this.paperdrawstore.getCnv());

        // workキャンバス要素を作成
        const workcnv: HTMLCanvasElement = document.createElement("canvas");
        workcnv.width = this.cw;
        workcnv.height = this.ch;
        const workctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>workcnv.getContext("2d");
        workctx.fillStyle = "white";
        workctx.fillRect(0, 0, this.cw, this.ch);

        // drawstore,drawingの順に書き込み
        workctx.drawImage(drawingimg, 0, 0, drawingimg.width, drawingimg.height);
        workctx.drawImage(drawstoreimg, 0, 0, drawstoreimg.width, drawstoreimg.height);

        // workキャンバスを画像化＆データ化
        workcnv.toBlob((blob) => {
            // ダウンロード処理
            const dlele: HTMLAnchorElement = <HTMLAnchorElement>document.createElement("a");
            dlele.href = window.URL.createObjectURL(<Blob>blob);
            dlele.download = this.filename;
            dlele.click();
            window.URL.revokeObjectURL(dlele.href);
            U.toast.normal("download start ...");
        }, "image/png");
    }
}
