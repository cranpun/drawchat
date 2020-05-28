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
    public function store(Request $request)
    {
        $data = new \App\Desc();
        $data->user_id = $request->input("user_id", 1);
        $data->json_desc = $request->input("json_desc", "");
        $data->room_id = $request->input("json_desc", 0);
        $data->save();
    }

    /**
     * MYTODO no login時の暫定API
     */
    public function userid($room_id)
    {
        $q = \App\Desc::where("room_id", "=", $room_id);
        $ret = $q->max("user_id");
        $ret++; // 次のユーザIDなので+1
        return response($ret);
    }
}
