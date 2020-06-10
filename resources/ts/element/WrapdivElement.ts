export class WrapdivElement {
    private wrapdiv: HTMLDivElement;

    constructor() {
        this.wrapdiv = document.querySelector("#drawcanvases");
    }

    public element(): HTMLDivElement {
        return this.wrapdiv;
    }

    public setNormal(): void {
        this.wrapdiv.style.backgroundColor = "#FFFFFF00";
    }

    public setScroll(): void {
        this.wrapdiv.style.backgroundColor = "#00FF0077";
    }

    public setExpand(): void {
        this.wrapdiv.style.backgroundColor = "#FF000077";
    }
}