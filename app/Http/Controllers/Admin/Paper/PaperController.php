<?php

namespace App\Http\Controllers\Admin\Paper;

use Illuminate\Http\Request;

class PaperController extends \App\Http\Controllers\Controller
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

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function draw(Request $request, $paper_id = null)
    {
        $now_id = $paper_id;
        $paper = \App\Models\Paper::find($paper_id);
        if ($now_id == null) {
            $data = new \App\Models\Paper();
            $data->save();
            $now_id = $data->id;
            // ページを生成したのでリダイレクト
            return redirect("/paper/{$now_id}");
        }

        $created_at = $paper->created_at;

        $colors = [
            ["color" => "#000", "labelcolor" => "white", "label" => "黒"],
            ["color" => "#777", "labelcolor" => "black", "label" => "灰"],
            ["color" => "#FFF", "labelcolor" => "black", "label" => "白"],
            ["color" => "#000080", "labelcolor" => "white", "label" => "藍"],
            ["color" => "#00F", "labelcolor" => "white", "label" => "青"],
            ["color" => "#F00", "labelcolor" => "white", "label" => "赤"],
            ["color" => "#0F0", "labelcolor" => "black", "label" => "緑"],
            ["color" => "#00cc66", "labelcolor" => "black", "label" => "緑2"],
            ["color" => "#243829", "labelcolor" => "white", "label" => "深緑"],
            ["color" => "#FF0", "labelcolor" => "black", "label" => "黄"],
            ["color" => "#0FF", "labelcolor" => "black", "label" => "青緑"],
            ["color" => "#F0F", "labelcolor" => "white", "label" => "紫"],
            ["color" => "brown", "labelcolor" => "white", "label" => "茶"],
            ["color" => "orange", "labelcolor" => "black", "label" => "橙"],
            ["color" => "pink", "labelcolor" => "black", "label" => "桃"],
            ["color" => "#F4BE9B", "labelcolor" => "black", "label" => "肌"],
        ];

        $thicks = [
            ["thick" => "4",],
            ["thick" => "8",],
            ["thick" => "16",],
            ["thick" => "32",],
            ["thick" => "48",],
        ];

        return view("admin.paper.draw.main", compact(["paper", "created_at", "colors", "thicks"]));
    }
}
