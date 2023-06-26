import { DrawingCanvas } from "../data/DrawingCanvas";
import * as U from "../u/u";


export class PaperbgElement {
    private ele: HTMLElement;
    private webSocket: DrawchatWebSocket;
    private cmd: string

    constructor() {
        this.ele = <HTMLElement>document.querySelector("#act-paperbg");
        this.ele.addEventListener("change", () => this.proc());
    }
    public init(webSocket: DrawchatWebSocket, cmd: string) {
        this.webSocket = webSocket;
        this.cmd = cmd;
    }
    private async proc(): Promise<void> {
        this.webSocket.send(this.cmd, this.ele.value);
        U.toast.normal("はいけいをかえました。よみこみなおしてね");
    }
}
