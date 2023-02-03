<?php
namespace App\Http\Controllers\Admin\User;

use Illuminate\Http\Request;

trait UserTraitIndex
{
    public function index(Request $request) : \Illuminate\View\View
    {
        $q = \App\Models\User::query();
        $q->select([
            "user.id AS id",
            "user.name AS name",
            "user.display_name AS display_name",
        ]);
        $rows = $q->get();
        return view("admin.user.index.main", compact(["rows"]));
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}