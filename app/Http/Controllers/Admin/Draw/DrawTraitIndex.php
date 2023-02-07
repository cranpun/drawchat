<?php
namespace App\Http\Controllers\Admin\Draw;

use Illuminate\Http\Request;

trait DrawTraitIndex
{
    public function index($paper_id)
    {
        $q = \App\Models\Draw::where("paper_id", "=", $paper_id);
        $q->orderBy("id", "DESC");
        $ret = $q->get();
        return response($ret);
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}
