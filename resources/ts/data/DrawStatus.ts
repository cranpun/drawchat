import { Tool, DrawEvent } from "../u/types";

export class DrawStatus {
    private event: DrawEvent;
    private tool: Tool | null;

    constructor() {
        this.endStroke();
    }

    public endStroke(): void {
        this.event = "up";
        this.tool = null;
    }

    public startStroke(): void {
        // 操作開始
        this.event = "down";
        this.tool = null;
    }

    public setTool(tool): void {
        this.tool = tool;
    }
    public getTool(): Tool | null {
        return this.tool;
    }

    public isEndStroke(now: DrawEvent): boolean {
        return now === "up" && this.event !== "up";
    }
    public isStartStroke(now: DrawEvent): boolean {
        return now === "down";
    }
    public isDrawing(): boolean {
        return ["down", "move"].includes(this.event);
    }
}