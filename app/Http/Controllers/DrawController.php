<?php

namespace App\Http\Controllers;

use App\Models\Draw;
use Illuminate\Http\Request;

class DrawController extends Controller
{
    public function index($paper_id)
    {
        $q = \App\Models\Draw::where("paper_id", "=", $paper_id);
        $q->orderBy("created_at", "ASC");
        $ret = $q->get();
        return response($ret);
    }

    public function mine($paper_id, $user_id)
    {
        $q = \App\Models\Draw::where("paper_id", "=", $paper_id);
        $q->where("user_id", "=", $user_id);
        $q->orderBy("created_at", "ASC");
        $ret = $q->get();
        return response($ret);
    }

    public function other($paper_id, $user_id)
    {
        $q = \App\Models\Draw::where("paper_id", "=", $paper_id);
        $q->where("user_id", "!=", $user_id);
        $q->orderBy("created_at", "ASC");
        $ret = $q->get();
        return response($ret);
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function add(Request $request, $paper_id)
    {
        // 前回の記述を削除
        $data = new \App\Models\Draw();
        $data->user_id = $request->input("user_id", null);
        $data->user_id = in_array($data->user_id, [null, "null"]) ? $this->userid($paper_id) : $data->user_id;
        $data->json_draw = $request->input("json_draw", "");
        $data->paper_id = $paper_id;
        $data->save();
        return response([
            "user_id" => $data->user_id
        ]);
    }

    /**
     * MYTODO no login時の暫定API
     */
    public function userid($paper_id)
    {
        $q = \App\Models\Draw::where("paper_id", "=", $paper_id);
        $ret = $q->max("user_id");
        if($ret) {
            return $ret + 1;
        } else {
            // 最初のユーザなので1
            return 1;
        }
    }
}
