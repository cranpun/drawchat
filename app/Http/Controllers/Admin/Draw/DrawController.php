<?php

namespace App\Http\Controllers\Admin\Draw;

use App\Models\Draw;
use Illuminate\Http\Request;

class DrawController extends \App\Http\Controllers\Controller
{
    public function index($paper_id)
    {
        $q = \App\Models\Draw::where("paper_id", "=", $paper_id);
        $q->orderBy("id", "DESC");
        $ret = $q->get();
        return response($ret);
    }

    public function indexafter($paper_id, $after_paper_id)
    {
        $q = \App\Models\Draw::where("paper_id", "=", $paper_id);
        $q->where("id", ">", $after_paper_id);
        $q->orderBy("id", "DESC");
        $ret = $q->get();
        return response($ret);
    }

    public function mine($paper_id)
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        $user_id = $user->id;
        $q = \App\Models\Draw::where("paper_id", "=", $paper_id);
        $q->where("user_id", "=", $user_id);
        $q->orderBy("id", "DESC");
        $ret = $q->get();
        return response($ret);
    }

    public function other($paper_id, $user_id)
    {
        $q = \App\Models\Draw::where("paper_id", "=", $paper_id);
        $q->where("user_id", "!=", $user_id);
        $q->orderBy("id", "DESC");
        $ret = $q->get();
        return response($ret);
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function add(\Illuminate\Http\Request $request, $paper_id)
    {
        // 前回の記述を削除
        $user = $request->user();

        $data = new \App\Models\Draw();
        $data->user_id = $user->id;
        $data->json_draw = $request->input("json_draw", "");
        $data->paper_id = $paper_id;
        $data->save();
        return response([
            "user_id" => $data->user_id
        ]);
    }
}
