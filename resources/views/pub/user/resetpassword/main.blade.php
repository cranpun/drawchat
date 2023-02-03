<?php
/**
 * @param なし
 */
?>
@extends("pub.base")

@section("title")
新しいパスワード
@endsection

@section("labeltitle")
新しいパスワード
@endsection

@section("labelsubtitle")
@endsection

@section("main")
新しいパスワードをご入力ください。
<form method="POST" action="{{ route('password.update') }}">
    @csrf
    <x-myinput field="password" label="パスワード" type="password" defval="hogehoge" placeholder="" />
    <x-myinput field="password_confirmation" label="パスワード（確認）" type="password" defval="hogehoge" placeholder="" />
    <x-myinput field="email" label="メールアドレス" type="email" defval="hogehoge@fugafuga.com" placeholder="" />
    <div><small>※念のため、メールアドレスをもう一度ご入力ください。</small></div>
    <input type="hidden" name="token" id="token" value="{{ $token }}">
    <button type="submit" class="button">設定</button>
</form>
@endsection