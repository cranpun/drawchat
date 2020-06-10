import { Datastore } from "../Datastore";
import * as U from "../u";
import { Point } from "../types";

export class ScrollAction {
    private prep: Point;
    public setPoint(x: number, y: number) {
        this.prep = new Point(x, y, 0);
    }

    public proc(x: number, y: number): void {
        // 差分の計算
        const dx = (x - this.prep.x);
        const dy = (y - this.prep.y);
        window.scrollBy(dx, dy);
        console.log("scroll", dx, dy);
        // ポイントの更新
        this.prep.x = x;
        this.prep.y = y;
    }
}
