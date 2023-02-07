@extends("pub.base")

@section("title")
ログイン
@endsection

@section("labeltitle")
ログイン
@endsection

@section("labelsubtitle")
@endsection

@section("main")
<div class="container">
    <style type="text/css">
        header, #main-header {
            display: none;
        }
    </style>
    <div class="title m-b-md has-text-centered">
        <img alt="drawchat" src="{{ \App\U\U::publicfiletimelink('img/logo.png') }}">
    </div>
    <form method="POST" action="{{ route('authenticate') }}">
        @csrf
        <x-myinput field="name" label="アカウント" type="text" :defval="old('name', '')" placeholder="アカウントを入力" />
        <x-myinput field="password" label="パスワード" type="password" defval="" placeholder="パスワードを入力" />
        <div class="field">
            <div class="control">
                <button id="act-login" type="submit" class="button">ログイン</button>
            </div>
        </div>
    </form>
    <?php if (false) : ?>
        <div class="mt-5">
            <a href="{{ route('register') }}" class='button'>新規登録</a>
            <a href="{{ route('password.request') }}" class='button'>パスワードをお忘れの方（パスワードリセット）</a>
        </div>
    <?php endif; ?>
</div>
@endsection