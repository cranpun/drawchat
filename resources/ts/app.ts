import { DrawEventHandler } from "./DrawEventHandler";

const bulmaNavDrop = (e: Event) => {
    const target: HTMLElement = <HTMLElement>e.target;
    target.parentElement?.parentElement?.classList.toggle("is-active");
}
const initBulmaNavDrop = () => {
    document.querySelectorAll(".dropdown .dropdown-trigger a").forEach(nav => {
        nav.addEventListener("click", bulmaNavDrop);
        nav.addEventListener("touchend", bulmaNavDrop);
    });
};
// const bulmaNavDrop = (e: Event) => {
//     const target: HTMLElement = <HTMLElement>e.target;
//     target.parentElement?.classList.toggle("is-active");
// }
// const initBulmaNavDrop = () => {
//     document.querySelectorAll(".has-dropdown .navbar-link").forEach(nav => {
//         nav.addEventListener("click", bulmaNavDrop);
//         nav.addEventListener("touchend", bulmaNavDrop);
//     });
// };
window.addEventListener("load", async () => {
    if (document.querySelector("#drawcanvases")) {
        const sense: DrawEventHandler = new DrawEventHandler();
        sense.init();
    }
    const body: HTMLBodyElement = <HTMLBodyElement>document.querySelector("body");

    // iosのときのピンチやダブルクリックによる拡大を無効化
    body.addEventListener("touchstart", (e: TouchEvent) => {
        e.preventDefault();
    }, { passive: false });

    initBulmaNavDrop();
});