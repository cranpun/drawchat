<?php
namespace App\Http\Controllers\Admin\Draw;

use Illuminate\Http\Request;

trait DrawTraitAdd
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function add(\Illuminate\Http\Request $request, $paper_id)
    {
        $user = $request->user();

        $data = new \App\Models\Draw();
        $data->user_id = $user->id;
        $data->json_draw = $request->input("json_draw", "");
        $data->paper_id = $paper_id;
        $data->save();
        return response([
            "result" => "success",
        ]);
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}
