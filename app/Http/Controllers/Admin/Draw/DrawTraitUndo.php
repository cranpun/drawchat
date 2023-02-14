<?php
namespace App\Http\Controllers\Admin\Draw;

trait DrawTraitUndo
{
    public function undo(\Illuminate\Http\Request $request, $paper_id)
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        $user_id = $user->id;
        $q = \App\Models\Draw::query();
        $q->where("paper_id", "=", $paper_id);
        $q->orderBy("id", "desc");
        $q->where("user_id", "=", $user_id);
        $q->orderBy("id", "DESC");
        $row = $q->first(); // 最新のdraw

        // この記述のjsonを復元
        $json = json_decode($row->json_draw);
        // 一番最初のstrokeを除去
        array_pop($json);
        if(count($json) > 0) {
            // 一筆なくしたdrawで更新
            $row->json_draw = json_encode($json);
            $row->save();
        } else {
            // 記述がなくなったのでdraw自体削除
            $row->delete();
        }

        // 現在のpaperの記述を全部取得して返す
        $ret = $this->load($request, $paper_id);
        return $ret;
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}
