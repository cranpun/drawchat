import { DrawMine } from "../data/DrawMine";
import * as U from "../u/u";
import { PaperElement } from "./PaperElement";


export class DownloadElement {

    private ele: HTMLElement;
    private papermine: PaperElement;
    private paperother: PaperElement;
    private cw: number;
    private ch: number;

    constructor() {
        this.ele = <HTMLElement>document.querySelector("#act-download");
        this.ele.addEventListener("click", async () => { await this.proc() });
        this.ele.addEventListener("touchend", async () => { await this.proc() });
    }
    public init(papermine: PaperElement, paperother: PaperElement, cw: number, ch: number) {
        this.papermine = papermine;
        this.paperother = paperother;
        this.cw = cw;
        this.ch = ch;
    }
    private async proc(): Promise<void> {
        // mineを画像化
        const mineimg: HTMLImageElement = await U.toImage(this.papermine.getCnv());

        // otherを画像化
        const otherimg: HTMLImageElement = await U.toImage(this.paperother.getCnv());

        // workキャンバス要素を作成
        const workcnv: HTMLCanvasElement = document.createElement("canvas");
        workcnv.width = this.cw;
        workcnv.height = this.ch;
        const workctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>workcnv.getContext("2d");
        workctx.fillStyle = "white";
        workctx.fillRect(0, 0, this.cw, this.ch);

        // other,mineの順に書き込み
        workctx.drawImage(mineimg, 0, 0, mineimg.width, mineimg.height);
        workctx.drawImage(otherimg, 0, 0, otherimg.width, otherimg.height);

        // workキャンバスを画像化＆データ化
        workcnv.toBlob((blob) => {
            // ダウンロード処理
            const dlele: HTMLAnchorElement = <HTMLAnchorElement>document.createElement("a");
            dlele.href = window.URL.createObjectURL(<Blob>blob);
            dlele.download = "hoge.png";
            dlele.click();
            window.URL.revokeObjectURL(dlele.href);
            U.toast.normal("download start ...");
        }, "image/png");
    }
}
