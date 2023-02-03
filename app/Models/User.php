<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = "users";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    static function validaterule() : array
    {
        return [
            "name" => "required|unique:user",
            "display_name" => "required|string",
            // "role" => "required|in:" . join(",", array_keys((new \App\L\Role())->labels())),
            "role" => "required|in:" . \App\L\Role::ID_ADMIN,
            "email" => "nullable|email:rfc",
            "password" => "required|min:8|confirmed",
            "last_datetime" => "nullable|datetime",
            "last_action" => "nullable|string",
            "last_user_id" => "nullable|integer",
        ];
    }

    public function saveProc(array $data) : bool
    {
        $this->password = array_key_exists("password", $data) ? \Illuminate\Support\Facades\Hash::make($data['password']) : $this->password;
        $this->name = array_key_exists("name", $data) ? $data["name"] : $this->name;
        $this->display_name = array_key_exists("display_name", $data) ? $data["display_name"] : $this->display_name;
        $this->email = array_key_exists("email", $data) ? $data["email"] : $this->email;
        $this->role = array_key_exists("role", $data) ? $data["role"] : $this->role;
        $user = \Illuminate\Support\Facades\Auth::user();
        $this->last_user_id = $user ? $user->getAuthIdentifier() : 0;
        $ret = $this->save();
        return $ret;
    }

    // *********************************************************************************
    // role
    // *********************************************************************************
    public function isRoles(array $roles) : bool
    {
        $ret = in_array($this->role, $roles);
        return $ret;
    }

    public function isAdmin() : bool
    {
        return $this->isRoles([\App\L\Role::ID_ADMIN]);
    }

    public static function isPub() : bool
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        return !$user;
    }

    public static function isLogin() : bool
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        return !(!$user);
    }
    public static function isLoginRoles(array $roles) : bool
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        if($user) {
            return $user->isRoles($roles);
        } else {
            // ログインしていない
            return false;
        }
    }
    // *********************************************************************************
    // static
    // *********************************************************************************

    // *********************************************************************************
    // load
    // *********************************************************************************

    // *********************************************************************************
    // passwordreseet
    // *********************************************************************************
    /**
     * パスワードリセット通知をユーザーに送信
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $url = route("password.reset", compact(["token"]));

        $this->notify(new \App\Notifications\ResetPasswordNotification($url));
    }
}
