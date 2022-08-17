import { PenAction } from "../action/PenAction";
import * as U from "../u/u";

export class ColorElement {
    private pen: PenAction


    public init(pen: PenAction, color: string): void {
        this.pen = pen;
        document.querySelectorAll(".pen-color").forEach((ele: HTMLElement) => {
            ele.addEventListener("click", (ev: Event) => {
                const item = <HTMLElement>ev.target;
                const color = item.style.backgroundColor;
                this.pen.opt.color = color;
                U.toast.normal(`change to ${color}`);
                // this.pen.opt.color = U.toRgbHex(color);
            });
        });
    }
}