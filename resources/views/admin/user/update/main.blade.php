@extends("admin.base")

@section("title")
ユーザ編集
@endsection

@section("labeltitle")
ユーザ編集
@endsection

@section("labelsubtitle")
@endsection

@section("main")
<form class="container" method="POST" action="{{ route('admin-user-updatestore') }}">
    @csrf
    <input type="hidden" name="id" id="id" value="{{ $row['id'] }}">
    <x-myinput field="name" label="アカウント" type="text" :defval="old('name', $row['name'])" placeholder="重複不可" />
    <x-myinput field="display_name" label="氏名" type="text" :defval="old('display_name', $row['display_name'])" placeholder="" />
    <div class="field">
        <div class="control">
            <button id="act-submit" type="submit" class="button">更新</button>
        </div>
    </div>
</form>
@endsection