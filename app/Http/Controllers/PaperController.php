<?php

namespace App\Http\Controllers;

use App\Models\Paper;
use Illuminate\Http\Request;

class PaperController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $q = \App\Models\Paper::orderBy("id", "DESC");
        $ret = $q->get();
        return view("welcome", ["papers" => $ret]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $paper_id = null)
    {
        $now_id = $paper_id;
        $paper = \App\Models\Paper::find($paper_id);
        if($now_id == null) {
            $data = new \App\Models\Paper();
            $data->save();
            $now_id = $data->id;
            // ページを生成したのでリダイレクト
            return redirect("/paper/{$now_id}");
        }

        $colors = [
            ["color" => "#000", "labelcolor" => "white", "label" => "黒"],
            ["color" => "#FFF", "labelcolor" => "black", "label" => "白"],
            ["color" => "#00F", "labelcolor" => "white", "label" => "青"],
            ["color" => "#F00", "labelcolor" => "white", "label" => "赤"],
            ["color" => "#0F0", "labelcolor" => "black", "label" => "緑"],
            ["color" => "#FF0", "labelcolor" => "black", "label" => "黄"],
            ["color" => "#0FF", "labelcolor" => "black", "label" => "青緑"],
            ["color" => "#F0F", "labelcolor" => "white", "label" => "紫"],
        ];

        $thicks = [
            ["thick" => "2",],
            ["thick" => "4",],
            ["thick" => "6",],
            ["thick" => "8",],
            ["thick" => "10",],
            ["thick" => "12",],
            ["thick" => "14",],
            ["thick" => "16",],
            ["thick" => "18",],
        ];

        return view("paper", compact(["paper", "colors", "thicks"]));
    }
}
