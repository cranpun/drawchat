import { TouchSensor } from "../sensor/TouchSensor";
import { ZoomScrollAction } from "../action/ZoomScrollAction";

export class ZoomElement {
    private lbl: HTMLSpanElement;
    private btp: HTMLButtonElement;
    private btm: HTMLButtonElement;
    private zoomscroll: ZoomScrollAction;

    public init(zoomscroll: ZoomScrollAction): void {
        this.zoomscroll = zoomscroll;
        this.lbl = <HTMLElement>document.querySelector("#zoom-label");
        this.btp = <HTMLButtonElement>document.querySelector("#zoom-plus");
        this.btm = <HTMLButtonElement>document.querySelector("#zoom-minus");

        this.btp.addEventListener("click", () => this.zoomscroll.zoomproc(0.1));
        this.btp.addEventListener("touchstart", () => this.zoomscroll.zoomproc(0.1));
        this.btm.addEventListener("click", () => this.zoomscroll.zoomproc(-0.1));
        this.btm.addEventListener("touchstart", () => this.zoomscroll.zoomproc(-0.1));
    }
    public label(): HTMLSpanElement {
        return this.lbl;
    }
    public show(nowzoom: number): void {
        this.lbl.innerHTML = `${Math.round(nowzoom * 100).toString()}%`;
    }
}