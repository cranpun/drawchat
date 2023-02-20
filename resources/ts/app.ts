import { DrawEventHandler, DrawchatParams, DrawchatWSParams } from "./DrawEventHandler";
import { setCsrfToken } from "./u/csrf";

interface Window {
    drawchat: {
        main: (params: DrawchatParams, constsJson: string) => void,
        ttt: (test: string) => void,
    }
}
declare var window: Window & typeof globalThis
const ttt = (test: string) => {
    console.log(test);
}
const main = (params: DrawchatParams, constsJson: string) =>
{
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

    // set csrf
    setCsrfToken(params.csrf_token);

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
            const data = {
                ws_token: wsparams.token,
                draw: `[1,23]`,
                paper_id: 1,
            }
            conn.send(JSON.stringify(data));
        }
        cnt++;
    });
}