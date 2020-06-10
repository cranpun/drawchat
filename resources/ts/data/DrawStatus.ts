import { Point, DrawEvent, Tool } from "../u/types";

export class DrawStatus {
    private zoom: number;
    private event: DrawEvent;
    private tool: Tool;

    constructor() {
        this.zoom = 1;
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
    public getTool(): Tool {
        return this.tool;
    }

    public isEndStroke(now: DrawEvent): boolean {
        return now === "up" && this.event !== "up";
    }
    public isStartStroke(now: DrawEvent): boolean {
        return now === "down";
    }
    public isStartMove(now: DrawEvent): boolean {
        // ツールが未決定
        return this.isMove(now) && this.tool === null;
    }
    public isMove(now: DrawEvent): boolean {
        return now === "move" && this.event === "down";
    }
}