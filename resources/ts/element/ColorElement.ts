import { PenAction } from "../action/PenAction";
import * as U from "../u/u";

export class ColorElement {
    private pen: PenAction

    public init(pen: PenAction): void {
        this.pen = pen;
        const handler = (ev: Event) => {
            const item = <HTMLElement>ev.target;
            const color = item.style.backgroundColor;
            this.pen.opt.color = color;
            U.toast.normal(`change to ${color}`);

            // 見た目の色を変更
            const pen = <HTMLElement>document.querySelector("#color-label");
            pen.style.color = color;

            // メニューを閉じる
            document.querySelector("#color-dropdown.is-active")?.classList.remove("is-active");
        };
        document.querySelectorAll(".pen-color").forEach((ele: Element) => {
            ele.addEventListener("click", handler);
            ele.addEventListener("touchend", handler);
        });
    }
}