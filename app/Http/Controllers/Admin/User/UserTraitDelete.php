<?php
namespace App\Http\Controllers\Admin\User;

use Illuminate\Http\Request;

trait UserTraitDelete
{
    public function delete(Request $request, string $user_id) : \Illuminate\Http\RedirectResponse
    {
        $row = \App\Models\User::find($user_id);
        if($row) {
            // ユーザ削除はactiveをoffに。
            if(!$row->delete()) {
                // 保存失敗
                \App\U\U::invokeErrorValidate($request, "削除に失敗しました。");
            }
            // それぞれのroleに応じた一覧へ移動。
            return redirect()->route("admin-user-index")->with("message-success", "削除しました。");
        } else {
            // それぞれのroleに応じた一覧へ移動。
            return redirect()->route("admin-user-index")->with("message-error", "削除対象が見つかりませんでした。");
        }
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}