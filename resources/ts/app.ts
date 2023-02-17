import { DrawEventHandler, DrawchatParams, DrawchatWSParams } from "./DrawEventHandler";
import { setDrawchatParams } from "./u/u";
interface Window {
    drawchat: {
        main: (params: DrawchatParams) => void,
        ttt: (test: string) => void
    }
}
declare var window: Window & typeof globalThis
const ttt = (test: string) => {
    console.log(test);
}
const main = (params: DrawchatParams) =>
{
    setDrawchatParams(params);
    if (document.querySelector("#drawcanvases")) {
        const sense: DrawEventHandler = new DrawEventHandler();
        sense.init(params);
    }
    const body: HTMLBodyElement = <HTMLBodyElement>document.querySelector("body");

    // iosのときのピンチやダブルクリックによる拡大を無効化
    body.addEventListener("touchstart", (e: TouchEvent) => {
        const src: HTMLElement = <HTMLElement>e.target;
        if ((["move-pad"].indexOf(src.id) < 0)) {
            e.preventDefault();
        }
    }, { passive: false });
    ws(params.ws);
}

window.drawchat = {
    main: main,
    ttt: ttt
}

let cnt = 0;
const ws = (wsparams: DrawchatWSParams) => {
    const conn = new WebSocket(wsparams.url);
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