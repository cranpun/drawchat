const Swal = require("sweetalert2");

export function tt(mes: string): void
{
    Swal.fire({
        text: mes,
        toast: true,
        position: "bottom-end",
        timer: 3 * 1000,
        showConfirmButton: false
    });
}
