<?php
namespace App\Http\Controllers\Pub\User;

trait UserTraitLogin
{
    public function login() : Object
    {
        if(\App\Models\User::isLogin()) {
            // ログイン済みなのでリダイレクト
            return redirect()->intended(route("top"))->with("message-success", "ログイン済みのためホームに移動しました。");;;
        }
        return view("pub.user.login.main");
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}