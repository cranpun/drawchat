<?php
namespace App\Http\Controllers\Admin\User;

use Illuminate\Http\Request;

trait UserTraitUpdatestore
{
    public function updatestore(\Illuminate\Http\Request $request) : \Illuminate\Http\RedirectResponse
    {
        $data = $request->all();
        $id = array_key_exists("id", $data) ? $data["id"] : null;

        if($id) {
            // update
            $row = \App\Models\User::where("id", "=", $id)->get()->toArray()[0];
            // ユーザ名が同じであればuniqueは外す
            $val = \App\Models\User::validaterule();
            if($row["name"] == $data["name"]) {
                $val["name"] = "required";
            }
            unset($val["password"]); // updateのときはpasswordとroleのチェックは不要
            unset($val["role"]);
            $request->validate($val);
        } else {
            $row = new \App\Models\User();
            $data = $request->all();
            $data["role"] = \App\L\Role::ID_ADMIN; // roleは固定
            \Validator::make($data, \App\Models\User::validaterule())->validate();
        }
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