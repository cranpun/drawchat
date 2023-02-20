import { DrawchatParams } from "../DrawEventHandler";
const Swal = require("sweetalert2");

export function pd(...mes: any): void {
    console.log(mes);
}

function normal(mes: string) {
    Swal.fire({
        text: mes,
        toast: true,
        position: "top-end",
        timer: 3 * 1000,
        showConfirmButton: false
    });
}
async function confirm(mes: string, ok: string, cancel: string): Promise<boolean> {
    const res = await Swal.fire({
        text: mes,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: ok,
        showCancelButton: true,
        cancelButtonText: cancel
    });
    const ret: boolean = res.value;
    return ret;
}
export var toast = {
    normal: normal,
    confirm: confirm
}
export function toRgbHex(col: string): string {
    return "#" + col.match(/\d+/g).map(function (a) { return ("0" + parseInt(a).toString(16)).slice(-2) }).join("");
}
export async function toImage(cnv: HTMLCanvasElement): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image: HTMLImageElement = new Image();
        const ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>cnv.getContext("2d");
        image.onload = () => resolve(image);
        image.onerror = (e) => reject(e);
        image.src = ctx.canvas.toDataURL();
    });
}
