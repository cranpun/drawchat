<?php

namespace App\Http\Controllers;

use App\Desc;
use Illuminate\Http\Request;

class DescController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($room_id)
    {
        $q = \App\Desc::where("room_id", "=", $room_id);
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
    public function add(Request $request, $room_id)
    {
        // 前回の記述を削除
        $data = new \App\Desc();
        $data->user_id = $request->input("user_id", $this->userid($room_id));
        $data->user_id = $data->user_id == null ? $this->userid($room_id) : $data->user_id;
        $data->json_desc = $request->input("json_desc", "");
        $data->room_id = $room_id;
        $data->save();
        return response([
            "user_id" => $data->user_id
        ]);
    }

    /**
     * MYTODO no login時の暫定API
     */
    public function userid($room_id)
    {
        $q = \App\Desc::where("room_id", "=", $room_id);
        $ret = $q->max("user_id");
        $ret++; // 次のユーザIDなので+1
        return $ret;
    }
}
