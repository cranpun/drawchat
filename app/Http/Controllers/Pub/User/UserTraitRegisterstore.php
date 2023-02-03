<?php
namespace App\Http\Controllers\Pub\User;

trait UserTraitRegisterstore
{
    public function registerstore(\Illuminate\Http\Request $request) : \Illuminate\Http\RedirectResponse
    {
        $data = $request->all();
        $row = new \App\Models\User();
        $data = $request->all();
        $data["role"] = \App\L\Role::ID_ADMIN; // roleは固定
        \Validator::make($data, \App\Models\User::validaterule())->validate();
        if(!$row->saveProc($data)) {
            // 保存失敗
            \App\U\U::invokeErrorValidate($request, "登録に失敗しました。");
        }

        // 本登録メール送信。EventSserviceProviderで受け取られる
        event(new \Illuminate\Auth\Events\Registered($row));

        return redirect()->route("verification.notice");
    }
    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}