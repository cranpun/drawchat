export class LinkElement {
    private ele: HTMLElement;

    public init() {
        this.ele = <HTMLElement>document.querySelector("#act-link");
        this.ele.addEventListener("click", (e: MouseEvent) => this.proc());
        this.ele.addEventListener("touchend", (e: TouchEvent) => this.proc());
    }

    public async proc(): Promise<void> {
        window.location.reload();
    }

    public setLabelLinkOn(): void {
        this.setLabel("link");
    }
    public setLabelLinkOff(): void {
        this.setLabel("link_off");
    }

    private setLabel(label: string): void {
        this.ele.querySelector(".label").innerHTML = label;
    }
}

