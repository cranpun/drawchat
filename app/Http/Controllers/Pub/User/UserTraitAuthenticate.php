<?php

namespace App\Http\Controllers\Pub\User;

trait UserTraitAuthenticate
{
    public function authenticate(\Illuminate\Http\Request $request): ?\Illuminate\Http\RedirectResponse
    {
        $credentials = $request->validate([
            "name" => ["required"],
            "password" => ["required"]
        ]);
        // $credentials["active"] = \App\L\OnOff::ID_ON;
        $res = \Illuminate\Support\Facades\Auth::attempt($credentials);
        $data = $request->all();
        if ($res) {
            $request->session()->regenerate();

            // activeの確認：nameで認証
            $user = \App\Models\User::where("name", "=", $data["name"])->first();

            // ログイン成功
            return redirect()->intended(route("top"));
        } else {
            return back()->with("message-error", "認証に失敗しました")->onlyInput("name");
        }
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}
