<?php
/**
 * @param なし
 */
$modalaction = "register";
$posturl = route('registerstore');
?>

@extends("pub.base")

@section("title")
仮登録
@endsection

@section("labeltitle")
仮登録
@endsection

@section("labelsubtitle")
@endsection

@section("main")
<form name="form-{{ $modalaction }}" id="form-{{ $modalaction }}" method="POST" action="{{ $posturl }}" class="">
    @csrf
    <x-myinput field="name" label="アカウント" type="text" defval="hogehoge" placeholder="" />
    <x-myinput field="email" label="メールアドレス" type="email" defval="hogehoge@fugafuga.com" placeholder="" />
    <x-myinput field="display_name" label="ニックネーム" type="text" defval="ホゲホゲ" placeholder="" />
    <x-myinput field="password" label="パスワード" type="password" defval="hogehoge" placeholder="" />
    <x-myinput field="password_confirmation" label="パスワード（確認）" type="password" defval="hogehoge" placeholder="" />
    <fieldset class="field">
        <button type="submit" id="act-{{ $modalaction }}" class="button">登録</button>
    </fieldset>
</form>
@endsection