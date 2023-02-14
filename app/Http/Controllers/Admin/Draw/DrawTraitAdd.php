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

        $json_draw = $request->input("json_draw", "");;
        if($json_draw == "[]" || !$json_draw || $json_draw == "") {
            return response([
                "result" => "no draw",
            ]);
        }

        $data = new \App\Models\Draw();
        $data->user_id = $user->id;
        $data->json_draw = $json_draw;
        $data->paper_id = $paper_id;
        $data->save();

        $ret = $this->load($request, $paper_id);
        return $ret;
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}
