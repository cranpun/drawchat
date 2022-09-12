export class ZoomElement {
    private lbl: HTMLSpanElement;
    private btp: HTMLButtonElement;
    private btm: HTMLButtonElement;
    private orgw: number = 0;
    private orgh: number = 0;

    private readonly ZOOM_MAX: number = 10;
    private readonly ZOOM_MIN: number = 0.1;

    private nowzoom: number = 1;

    public init(): void {
        const ele: HTMLElement = <HTMLElement>document.querySelector("main");
        this.orgw = parseInt(ele.style.width.replace("px", ""));
        this.orgh = parseInt(ele.style.height.replace("px", ""));

        this.lbl = <HTMLElement>document.querySelector("#zoom-label");
        this.btp = <HTMLButtonElement>document.querySelector("#zoom-plus");
        this.btm = <HTMLButtonElement>document.querySelector("#zoom-minus");

        this.btp.addEventListener("click", () => this.zoomproc(0.1));
        this.btp.addEventListener("touchstart", () => this.zoomproc(0.1));
        this.btm.addEventListener("click", () => this.zoomproc(-0.1));
        this.btm.addEventListener("touchstart", () => this.zoomproc(-0.1));

        this.show();
    }
    public label(): HTMLSpanElement {
        return this.lbl;
    }
    public show(): void {
        this.lbl.innerHTML = `${Math.round(this.nowzoom * 100).toString()}%`;
    }
    private zoomproc(diff: number): void {
        this.nowzoom += diff;
        // 範囲補正
        this.nowzoom = Math.min(Math.max(this.nowzoom, this.ZOOM_MIN), this.ZOOM_MAX);
        const ele: HTMLElement = <HTMLElement>document.querySelector("main");
        ele.style.transform = `scale(${this.nowzoom})`;
        this.show();
        ele.style.width = `${this.orgw * this.nowzoom}px`;
        ele.style.height = `${this.orgh * this.nowzoom}px`;
    }

    public getZoom(): number {
        return this.nowzoom;
    }
}