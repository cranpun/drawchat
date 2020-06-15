import * as AColorPicker from "a-color-picker";
import { PenAction } from "../action/PenAction";
import * as U from "../u/u";

export class ColorElement {
    private ele: HTMLElement;
    private pen: PenAction


    public init(pen: PenAction, color: string): void {
        this.pen = pen;
        this.ele = document.querySelector("#pen-color");
        AColorPicker.from("div#pen-color", {
            "color": color
        })[0]
        .on("change", (picker: any, color: string) => this.changed(picker, color));
    }
    public changed(picker: any, color: string) {
        this.pen.color = U.toRgbHex(color);
    }

    public static defcolor(): string {
        const ret = document.querySelector("#sd-color").innerHTML;
        return ret;
    }
}