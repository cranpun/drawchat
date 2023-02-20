export let csrf: string;
export function makeCsrfFormData(): FormData {
    // const csrf = document.querySelector("#sd-csrf-token").textContent;
    const formData: FormData = new FormData();
    formData.append("_token", csrf);
    return formData;
};
export function setCsrfToken(v: string): void {
    csrf = v;
}