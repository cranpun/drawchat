import { Drawing } from "../../data/Drawing";

export abstract class ShapeProc {
    protected abstract proc(draw: Drawing): void;
    async exec(draw: Drawing): Promise<void> {
        await this.proc(draw);
    }
}