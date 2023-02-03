<section id="message-group" class="section py-0">
    @if (session('message-error'))
    <div id="message-error" class='notification is-danger is-light mt-2'>
        {{ session("message-error") }}
    </div>
    @endif
    @if (session('message-success'))
    <div id="message-success" class='notification is-success is-light mt-2'>{{ session("message-success") }}</div>
    @endif
    @if (session('message-debug-info') && config("app.debug") == "true")
    <div id="message-debug-info" class='notification is-danger is-light mt-2'>
        <pre>
        <code>
        {{ session("message-debug-info") }}
        </code>
        </pre>
    </div>
    @endif
    <?php if($errors->any()) : ?>
        <div id="message-error-validation" class='notification is-danger is-light mt-2'>
            <div>入力内容に問題がございました。ご確認の上、もう一度お試しください。</div>
            <?php foreach($errors->getMessages() as $key => $messages) : ?>
            <div>
                <div class="tag is-danger">{{ $key }}</div>
                <ul>
                    <?php foreach($messages as $message) : ?>
                    <li>{{ $message }}</li>
                    <?php endforeach ?>
                </ul>
            </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</section>
