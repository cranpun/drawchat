@extends("admin.base")

@section("title")
ユーザ一覧
@endsection

@section("labeltitle")
ユーザ一覧
@endsection

@section("labelsubtitle")
@endsection

@section("main")
<section class="mb-3">
    @include("admin.user.index.createmodal")
</section>
<table id="indextable" class="table is-fullwidth is-narrow is-bordered is-striped">
    <thead>
        <tr>
            <th>操作</th>
            <th>ID</th>
            <th>アカウント</th>
            <th>名前</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach($rows as $row): $id = $row['id']; ?>
        <tr id="row-<?= $id ?>">
            <td id="d-ctrl-<?= $id ?>">
                <a id="act-update-{{ $id }}" href="{{ route('admin-user-update', ['user_id' => $id]) }}" class="button is-small">編集</a>
                <span class="delbtn">
                    <x-mydelbutton 
                        url="{{ route('admin-user-delete', ['user_id' => $id]) }}"
                        id="{{ $id }}" 
                    />
                </span>
                <span class="psov">
                    <button id="act-overwritepassword-{{ $id }}" class="button is-small act-overwritepassword" data-form-cssid="#ovform-{{ $id }}" type="button">パスワード</button>
                    <form id="ovform-{{ $id }}" method="POST" action="{{ route('admin-user-overwritepassword', ['user_id' => $id]) }}" enctype="multipart/form-data" class="d-inline-block">
                        @csrf
                        <input type="hidden" name="id" value="{{ $id }}"></input>
                    </form>
                </span>
            </td>
            <td id="d-id-<?= $id ?>" class="d-id val"><?= $row["id"] ?></td>
            <td id="d-name-<?= $id ?>" class="d-name val"><?= $row["name"] ?></td>
            <td id="d-display_name-<?= $id ?>" class="d-display_name val"><?= $row["display_name"] ?></td>
        </tr>
        <?php endforeach; ?>
    </tbody>
</table>
<script type="text/javascript">
window.addEventListener("load", function() {
    U.setConfirmDelete()
    const ovbtns = document.querySelectorAll(".act-overwritepassword");
    ovbtns.forEach(function(btn) {
        btn.addEventListener("click", function(ev) {
            Swal.fire({
                title: "パスワード更新",
                text: "新しいパスワードを入力してください。",
                showCancelButton: true,
                icon: "info",
                input: "password",
                inputAttributes: {
                        minlength: 8,
                },
            }).then(function(res) {
                if(res.isConfirmed) {
                    const password = res.value;
                    const input = document.querySelector("input");
                    input.value = password;
                    input.name = "password";
                    const formid = ev.target.getAttribute("data-form-cssid");
                    const form = document.querySelector(formid);
                    form.appendChild(input);
                    form.submit();
                }
            });
        });
    });

});
</script>
@endsection