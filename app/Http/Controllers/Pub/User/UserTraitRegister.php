<?php
namespace App\Http\Controllers\Pub\User;

trait UserTraitRegister
{
    public function register(\Illuminate\Http\Request $request) : \Illuminate\View\View
    {
        return view("pub.user.register.main");
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}