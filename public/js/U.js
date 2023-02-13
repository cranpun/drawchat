U = {};

const bulmaNavDrop = (e) => {
    e.preventDefault();
    const target  = e.target;
    const menuitem = target.parentElement?.parentElement;
    let parent = menuitem;
    while(!parent.classList.contains("dropdown")) {
        parent = parent.parentElement;

    }

    // 既にメニューを開いていれば閉じるのみ
    const isOpen = parent.classList.contains("is-active");

    // その他のメニューは閉じる
    document.querySelectorAll(".is-active").forEach(ele => {
        ele.classList.remove("is-active");
        ele.classList.toggle("fadein");
    });

    if (!isOpen) {
        parent.classList.add("is-active");
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
    initBulmaNavDrop();
});