<?php
namespace App\Http\Controllers\Admin\Paper;

use Illuminate\Http\Request;

trait PaperTraitIndex
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $q = \App\Models\Paper::orderBy("id", "DESC");
        $raws = $q->get();

        $ret = [];

        foreach ($raws as $raw) {
            $drawq = \App\Models\Draw::where("paper_id", "=", $raw->id);
            $drawq->select([\DB::raw("LENGTH(json_draw) AS len")]);
            $draws = $drawq->get()->toArray();
            $len = array_sum(array_column($draws, "len"));
            $raw["len"] = $len;
            $ret[] = $raw;
        }
        return view("admin.paper.index.main", ["papers" => $ret]);
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}
