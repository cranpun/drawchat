const Swal = require("sweetalert2");

export function tt(mes: string, tt: boolean = false): void {
    if (tt) {
        Swal.fire({
            text: mes,
            toast: true,
            position: "bottom-end",
            timer: 3 * 1000,
            showConfirmButton: false
        });
    }
    console.log(mes);
    // const ta:HTMLTextAreaElement = document.querySelector("#prompt");
    // const val = mes + "\n" + ta.value ;
    // ta.value = val;
}