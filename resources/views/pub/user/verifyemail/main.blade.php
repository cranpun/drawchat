<?php
/**
 * @param なし
 */
?>
@extends("pub.base")

@section("title")
本登録未完了
@endsection

@section("labeltitle")
本登録未完了
@endsection

@section("labelsubtitle")
@endsection

@section("main")
入力いただいたメールアドレスに本登録メールが送信されています。ご確認ください。メールを再送する場合は以下のボタンを押してください。<br/>
<form method="POST" action="{{ route('verification.send') }}">
    @csrf
    <button type="submit" class="button">再送</button>
</form>
@endsection