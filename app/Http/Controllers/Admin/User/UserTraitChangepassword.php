<?php
namespace App\Http\Controllers\Admin\User;

use Illuminate\Http\Request;

trait UserTraitChangepassword
{
    public function changepassword(Request $request, string $user_id) : \Illuminate\Http\RedirectResponse
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        $validate = [
            "password"=> "required|min:8"
        ];
        try {
            $request->validate($validate);
        }catch(\Exception $e) {
            \App\U\U::invokeErrorValidate($request, "ご利用できないパスワードです。");
        }

        $password = $request->input("password");
        $row = \App\Models\User::where("id", "=", $user->id)->first();
        if(!$row->saveProc(["password" => $password])) {
            // 保存失敗
            \App\U\U::invokeErrorValidate($request, "保存に失敗しました。");
        }

        return redirect()->route("admin-user-index")->with("message-success", "保存しました。");
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}
