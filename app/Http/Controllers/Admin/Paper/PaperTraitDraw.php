<?php
namespace App\Http\Controllers\Admin\Paper;

use Illuminate\Http\Request;

trait PaperTraitDraw
{
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

        // 今回のws_tokenを生成して保存
        $user = \App\Models\User::find($request->user()->id);
        $ws_token = \App\U\U::gentimekey($user->id);
        $user->ws_token = $ws_token;
        $user->ws_token_at = \Carbon\Carbon::now()->addMilliseconds(config("drawchat.ws.token_limit_msec"))->format("Y-m-d H:i:s");
        $user->save();

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

        return view("admin.paper.draw.main", compact(["paper", "created_at", "colors", "thicks", "ws_token"]));
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}
