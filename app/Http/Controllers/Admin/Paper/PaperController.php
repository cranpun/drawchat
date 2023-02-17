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
            ["color" => "#000", "labelcolor" => "white", "label" => "くろ"],
            ["color" => "#777", "labelcolor" => "black", "label" => "ねずみいろ"],
            ["color" => "#FFF", "labelcolor" => "black", "label" => "しろ"],
            ["color" => "#000080", "labelcolor" => "white", "label" => "くらいあお"],
            ["color" => "#00F", "labelcolor" => "white", "label" => "あお"],
            ["color" => "#F00", "labelcolor" => "white", "label" => "あか"],
            ["color" => "#0F0", "labelcolor" => "black", "label" => "あかるいみどり"],
            ["color" => "#00cc66", "labelcolor" => "black", "label" => "みどり"],
            ["color" => "#243829", "labelcolor" => "white", "label" => "くらいみどり"],
            ["color" => "#FF0", "labelcolor" => "black", "label" => "きいろ"],
            ["color" => "#0FF", "labelcolor" => "black", "label" => "あおみどり"],
            ["color" => "#F0F", "labelcolor" => "white", "label" => "むらさき"],
            ["color" => "brown", "labelcolor" => "white", "label" => "ちゃいろ"],
            ["color" => "orange", "labelcolor" => "black", "label" => "おれんじ"],
            ["color" => "pink", "labelcolor" => "black", "label" => "ぴんく"],
            ["color" => "#F4BE9B", "labelcolor" => "black", "label" => "はだいろ"],
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
