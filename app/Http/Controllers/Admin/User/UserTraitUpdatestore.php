<?php
namespace App\Http\Controllers\Admin\User;

use Illuminate\Http\Request;

trait UserTraitUpdatestore
{
    public function updatestore(\Illuminate\Http\Request $request) : \Illuminate\Http\RedirectResponse
    {
        $data = $request->all();
        $id = array_key_exists("id", $data) ? $data["id"] : null;

        // update
        $row = \App\Models\User::find($id);
        // ユーザ名が同じであればuniqueは外す
        $val = \App\Models\User::validaterule();
        if($row["name"] == $data["name"]) {
            $val["name"] = "required";
        }
        unset($val["password"]); // updateのときはpasswordとroleのチェックは不要
        unset($val["role"]);
        $request->validate($val);

        if(!$row->saveProc($data)) {
            // 保存失敗
            \App\U\U::invokeErrorValidate($request, "更新に失敗しました。");
        }
        return redirect()->route("admin-user-index")->with("message-success", "更新しました。");
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}