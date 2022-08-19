import { PenAction } from "../action/PenAction";
import * as U from "../u/u";

export class ThickElement {
    private pen: PenAction

    public init(pen: PenAction): void {
        this.pen = pen;
        const handler = (ev: Event) => {
            const item: HTMLElement = <HTMLElement>ev.target;
            const px: string = item.getAttribute("data-width");
            const thick: number = parseInt(px);
            this.pen.opt.thick = thick;
            U.toast.normal(`change to ${thick}`);

            // 見た目の色を変更
            const pen = <HTMLElement>document.querySelector("#thick-label");
            pen.style.width = `${thick}px`;

            // メニューを閉じる
            document.querySelector("#thick-dropdown.is-active")?.classList.remove("is-active");
        };
        document.querySelectorAll(".pen-thick").forEach(ele => {
            ele.addEventListener("click", handler);
            ele.addEventListener("touchend", handler);
        });
    }
}