<?php
/**
 * @param なし
 */
$modalaction = "create";
$posturl = route('admin-user-createstore');
?>
 <section class="mb-3">
    <a class="button" id="act-{{ $modalaction }}-open" onclick="document.querySelector('#modal-{{ $modalaction }}').classList.add('is-active');">登録</a>
    <div id="modal-{{ $modalaction }}" class="modal">
        <div class="modal-background" onclick="document.querySelector('#modal-{{ $modalaction }}').classList.remove('is-active')"></div>
        <div class="modal-content">
            <div class="box">
                <form name="form-{{ $modalaction }}" id="form-{{ $modalaction }}" method="POST" action="{{ $posturl }}" class="">
                    @csrf
                    <x-myinput field="name" label="アカウント" type="text" defval="" placeholder="" />
                    <x-myinput field="display_name" label="名前" type="text" defval="" placeholder="" />
                    <x-myinput field="password" label="パスワード" type="password" defval="" placeholder="" />
                    <x-myinput field="password_confirmation" label="パスワード（確認）" type="password" defval="" placeholder="" />
                    <fieldset class="field">
                        <button type="submit" id="act-{{ $modalaction }}" class="button">登録</button>
                    </fieldset>
                </form>
            </div>
        </div>
        <button class="modal-close" onclick="document.querySelector('#modal-{{ $modalaction }}').classList.remove('is-active')">閉じる</button>
    </div>
</section>
