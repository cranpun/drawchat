
export class PaperElement {
    private cnv: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    public static makeMine(): PaperElement {
        return new PaperElement("#mycanvas");
    }
    public static makeOther(): PaperElement {
        return new PaperElement("#othercanvas");
    }
    private constructor(selector: string) {
        this.cnv = document.querySelector(selector);
        this.ctx = this.cnv.getContext("2d");
    }

    public getCtx(): CanvasRenderingContext2D {
        return this.ctx;
    }
    public getCnv(): HTMLCanvasElement {
        return this.cnv;
    }
    public clear(): void {
        const w: number = this.cnv.width;
        const h: number = this.cnv.height;
        this.ctx.clearRect(0, 0, w, h);
    }
}
