import { Datastore } from "./Datastore";

export class Paper {
    private cnv: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    public static makeMine(): Paper {
        return new Paper("#mycanvas");
    }
    public static makeOther(): Paper {
        return new Paper("#othercanvas");
    }
    private constructor(selector: string) {
        this.cnv = document.querySelector(selector);
        this.ctx = this.cnv.getContext("2d");
    }

    public getCtx(): CanvasRenderingContext2D {
        return this.ctx;
    }
    public getCnv(): HTMLCanvasElement {
        return this.cnv;
    }
}
