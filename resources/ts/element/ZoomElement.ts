import { TouchSensor } from "../sensor/TouchSensor";

export class ZoomElement {
    private ele: HTMLSpanElement;
    public init(): void {
        this.ele = document.querySelector("#zoomscroll");
    }
    public elemenet(): HTMLSpanElement {
        return this.ele;
    }
    public show(nowzoom: number): void {
        this.ele.innerHTML = `${Math.round(nowzoom * 100).toString()}%`;
    }
}