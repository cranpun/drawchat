import { DrawData } from "../data/DrawData";
import * as U from "../u/u";
import { Point } from "../u/types";

export class ScrollAction {
    private prep: Point;
    public setPoint(x: number, y: number) {
        this.prep = new Point(x, y, 0);
    }

    public proc(x: number, y: number): void {
        // 差分の計算
        const dx = (this.prep.x - x) / 1.3;
        const dy = (this.prep.y - y) / 1.3;
        window.scrollBy(dx, dy);
        console.log("scroll", dx, dy);
        // ポイントの更新
        this.prep.x = x;
        this.prep.y = y;
    }
}
