<?php
/**
 * @param なし
 */
?>
@extends("pub.base")

@section("title")
パスワードリセット
@endsection

@section("labeltitle")
パスワードリセット
@endsection

@section("labelsubtitle")
@endsection

@section("main")
ご登録いただいたメールアドレスをご入力ください。パスワードをリセットする手続きについてのメールを送信いたします。<br/>
<form method="POST" action="{{ route('password.email') }}">
    @csrf
    <x-myinput field="email" label="メールアドレス" type="email" defval="hogehoge@fugafuga.com" placeholder="" />
    <button type="submit" class="button">リセット申請</button>
</form>
@endsection