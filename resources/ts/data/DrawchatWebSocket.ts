import { DrawchatParams } from "../DrawEventHandler";
import { CanvasElement } from "../element/CanvasElement";
import { LinkElement } from "../element/LinkElement";
import { toast } from "../u/u";
import { Stroke } from "./Draw";

export class DrawchatWebSocket {
    private params: DrawchatParams;
    private _webSocket: WebSocket;
    private drawnCanvas: CanvasElement;
    private link: LinkElement;

    public get webSocket(): WebSocket {
        return this._webSocket;
    }

    init(params: DrawchatParams, drawnCanvas: CanvasElement, link: LinkElement): void {
        this.params = params;
        this.drawnCanvas = drawnCanvas;
        this.link = link;

        // websocketの初期化
        try {
            this._webSocket = new WebSocket(this.params.ws.url);
        } catch (e) {
            toast.error("サーバに接続できませんでした。");
        }
        this.webSocket.onopen = (e: MessageEvent) => {
            this.onopen(e);
        };
        this.webSocket.onmessage = (e: MessageEvent) => {
            this.onmessage(e);
        }
        this.webSocket.onerror = async (e: MessageEvent) => {
            this.onerror(e);
        }
        this.webSocket.onclose = async (e: CloseEvent) => {
            this.onclose(e);
        }
    }
    send(cmd: string, draw: string): void {
        // PHPのDrawchatWSMessageToServerに合わせること
        const pack = {
            ws_token: this.params.ws.token,
            paper_id: this.params.paper_id,
            cmd: cmd,
            draw: draw
        }
        this.webSocket.send(JSON.stringify(pack));
    }

    onopen(e: MessageEvent): void {
        this.send(this.params.ws.cmds.server.get("register"), "");
        toast.normal("サーバに接続しました。");
        this.link.setLabelLinkOn();
    }

    onmessage(e: MessageEvent): void {
        // toast.normal("受信しました");
        const data: string = e.data;

        const obj = JSON.parse(data);
        if (obj.cmd === this.params.ws.cmds.client.get("draw")) {
            const draws = JSON.parse(obj.draw);
            const strokes = Stroke.parseStrokes(draws);
            this.drawnCanvas.clear();
            this.drawnCanvas.draw(strokes);
        }
    }

    onerror(e: MessageEvent): void {
        toast.error("サーバとの通信に障害が発生しました。");
        this.link.setLabelLinkOff();
    }

    onclose(e: CloseEvent): void {
        toast.error("サーバとの通信が切れました。再読み込みしてください。");
        this.link.setLabelLinkOff();
    }

    // const ws = (wsparams: DrawchatWSParams) => {
    //     const conn = new WebSocket(wsparams.url);
    //     conn.onopen = (e) => {
    //         console.log(e);
    //     };
    //     conn.onmessage = (e) => {
    //         console.log(e);
    //     }
    //     document.querySelector("#act-load").addEventListener("click", () => {
    //         if (cnt == 3) {
    //             conn.send("close");
    //         } else {
    //             const data = {
    //                 ws_token: wsparams.token,
    //                 draw: `[1,23]`,
    //                 paper_id: 1,
    //             }
    //             conn.send(JSON.stringify(data));
    //         }
    //         cnt++;
    //     });
    // }
}