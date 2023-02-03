<?php
use Illuminate\Support\Facades\Route;

use \App\Http\Controllers\Pub\User\UserController;

/************************************************************/
// user
/************************************************************/
Route::get("/login", [UserController::class, "login"])->name("login");
Route::post("/authenticate", [UserController::class, "authenticate"])->name("authenticate");
Route::post("/logout", function () {
    if (\Illuminate\Support\Facades\Auth::user()) {
        \Illuminate\Support\Facades\Auth::logout();
    }
    return redirect()->route("login");
})->name("logout");

// ユーザ登録
Route::get("/register", [UserController::class, "register"])->name("register");
Route::post("/registerstore", [UserController::class, "registerstore"])->name("registerstore");
Route::get('/email/verify', function () {
    return view('pub.user.verifyemail.main');
})->middleware('auth')->name('verification.notice');
Route::get('/email/verify/{id}/{hash}', function (\Illuminate\Foundation\Auth\EmailVerificationRequest $request) {
    $request->fulfill();

    return redirect(route('top'))->with("message-success", "本登録完了いたしました");
})->middleware(['auth', 'signed'])->name('verification.verify');
Route::post('/email/verification-notification', function (\Illuminate\Http\Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return back()->with('message-success', '再送しました');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');

// パスワードリセット
Route::get('/forgot-password', function () {
    return view('pub.user.forgotpassword.main');
})->middleware('guest')->name('password.request');

Route::post('/forgot-password', function (\Illuminate\Http\Request $request) {
    $request->validate(['email' => 'required|email']);

    $status = \Illuminate\Support\Facades\Password::sendResetLink(
        $request->only('email')
    );

    return $status === \Illuminate\Support\Facades\Password::RESET_LINK_SENT
                ? back()->with(["message-success" => "パスワードを再設定するためのメールを送信しました。ご確認ください（ステータス：{$status}）"])
                : back()->with(['message-error' => "メール送信に失敗しました。メールアドレスをご確認ください（ステータス：{$status}）"]);
})->middleware('guest')->name('password.email');

Route::get('/reset-password/{token}', function ($token) {
    return view('pub.user.resetpassword.main', ['token' => $token]);
})->middleware('guest')->name('password.reset');

Route::post('/reset-password', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed',
    ]);

    $status = \Illuminate\Support\Facades\Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            $user->forceFill([
                'password' => \Illuminate\Support\Facades\Hash::make($password)
            ])->setRememberToken(\Illuminate\Support\Str::random(60));

            $user->save();

            event(new \Illuminate\Auth\Events\PasswordReset($user));
        }
    );

    return $status === Illuminate\Support\Facades\Password::PASSWORD_RESET
                ? redirect()->route('login')->with(['message-success' => "パスワードを再設定しました（ステータス：{$status}）"])
                : back()->with(["message-error" => "パスワードの再設定に失敗しました（ステータス：{$status}）"]);
})->middleware('guest')->name('password.update');