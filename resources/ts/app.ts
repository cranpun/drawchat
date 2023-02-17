import { DrawEventHandler } from "./DrawEventHandler";

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
    ws();
});

let cnt = 0;
const ws = () => {
    const conn = new WebSocket("wss://dev.dev.ll/ws");
    console.log(document.cookie);
    conn.onopen = (e) => {
        console.log(e);
    };
    conn.onmessage = (e) => {
        console.log(e);
    }
    document.querySelector("#act-load").addEventListener("click", () => {
        if(cnt==3) {
            conn.send("close");
        } else {
            conn.send(`hoge${cnt}hoge`);
        }
        cnt++;
    });
}