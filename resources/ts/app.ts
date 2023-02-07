import { DrawEventHandler } from "./DrawEventHandler";

const bulmaNavDrop = (e: Event) => {
    e.preventDefault();
    const target: HTMLElement = <HTMLElement>e.target;
    const menuitem: HTMLElement = <HTMLElement>target.parentElement?.parentElement;
    const parent: HTMLElement = <HTMLElement>menuitem.parentElement.parentElement;

    // 既にメニューを開いていれば閉じるのみ
    const isOpen: boolean = parent.classList.contains("is-active");

    // その他のメニューは閉じる
    document.querySelectorAll(".is-active").forEach(ele => {
        if (ele !== menuitem) {
            ele.classList.remove("is-active");
            ele.classList.toggle("fadein");
        }
    });

    if (!isOpen) {
        parent.classList.toggle("is-active");
        parent.classList.toggle("fadein");
    }
}
const initBulmaNavDrop = () => {
    document.querySelectorAll(".dropdown .dropdown-trigger a").forEach(nav => {
        nav.addEventListener("click", bulmaNavDrop);
        nav.addEventListener("touchend", bulmaNavDrop);
    });
};

window.addEventListener("load", async () => {
    if (document.querySelector("#drawcanvases")) {
        const sense: DrawEventHandler = new DrawEventHandler();
        sense.init();
    }
    const body: HTMLBodyElement = <HTMLBodyElement>document.querySelector("body");

    // iosのときのピンチやダブルクリックによる拡大を無効化
    body.addEventListener("touchstart", (e: TouchEvent) => {
        const src: HTMLElement = <HTMLElement>e.target;
        if ((["move-pad"].indexOf(src.id) < 0)) {
            e.preventDefault();
        }
    }, { passive: false });

    initBulmaNavDrop();
});