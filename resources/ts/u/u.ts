const Swal = require("sweetalert2");

export function pd(...mes: any): void {
    console.log(mes);
}
export function tt(mes: string) {
    Swal.fire({
        text: mes,
        toast: true,
        position: "bottom-end",
        timer: 3 * 1000,
        showConfirmButton: false
    });
}
export function toRgbHex(col: string): string {
    return "#" + col.match(/\d+/g).map(function(a){return ("0" + parseInt(a).toString(16)).slice(-2)}).join("");
}
