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

        return view("paper", ["paper" => $paper]);
    }
}
