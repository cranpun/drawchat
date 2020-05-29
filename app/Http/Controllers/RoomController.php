<?php

namespace App\Http\Controllers;

use App\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $q = \App\Room::orderBy("id", "DESC");
        $ret = $q->get();
        return view("welcome", ["rooms" => $ret]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $room_id = null)
    {
        $now_id = $room_id;
        if($now_id == null) {
            $data = new \App\Room();
            $data->save();
            $now_id = $data->id;
            // ページを生成したのでリダイレクト
            return redirect("/room/{$now_id}");
        }

        return view("room", ["room_id" => $now_id]);
    }
}
