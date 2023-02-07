<?php
namespace App\Http\Controllers\Admin\Draw;

use Illuminate\Http\Request;

trait DrawTraitOther
{

    public function other($paper_id, $user_id)
    {
        $q = \App\Models\Draw::where("paper_id", "=", $paper_id);
        $q->where("user_id", "!=", $user_id);
        $q->orderBy("id", "DESC");
        $ret = $q->get();
        return response($ret);
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}
