<!DOCTYPE html>
<html lang="ja" style="height: 100%;">

<head>
    @include("head")
    <title>
        @yield("title") - drawchat
    </title>
</head>

<body id="body" style="display: flex; flex-flow: column; min-height: 100vh;">
    <header id="header" class="d-none-print">
        <nav class="navbar has-background-primary-light" role="navigation">
            <section class="navbar-brand">
                <a class="navbar-item" href="{{ url('/') }}">
                    drawchat
                </a>
                <a id="burger" role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
                    data-target="navbar-topnav">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
                <script type="text/javascript">
                    window.addEventListener("load", function () {
                        const burger = document.querySelector("#burger");
                        const target = document.getElementById(burger.dataset.target);
                        burger.addEventListener("click", function () {
                            burger.classList.toggle("is-active");
                            burger.classList.toggle("fadein");
                            target.classList.toggle("is-active");
                            target.classList.toggle("fadein");
                        });
                        burger.addEventListener("touchend", function (ev) {
                            ev.preventDefault();
                            burger.classList.toggle("is-active");
                            burger.classList.toggle("fadein");
                            target.classList.toggle("is-active");
                            target.classList.toggle("fadein");
                        });
                    })
                </script>
            </section>

            <section id="navbar-topnav" class="navbar-menu">
                <div class="navbar-start">
                    <a id="topnav-user" class="navbar-item" href="{{ route('admin-user-index') }}">
                        <span class="material-icons">manage_accounts</span>
                        <span>ユーザ</span>
                    </a>
                </div>
                <div class="navbar-end">
                    <div id="topnav-endmenu" class="navbar-item has-dropdown">
                        <a id="topnav-myname" class="navbar-link">{{ \Illuminate\Support\Facades\Auth::user()->display_name }}<span class=" caret"></span></a>
                        <div id="topnav-myname-menu" class="navbar-dropdown is-right">
                            <a id="topnav-changepassword" class="navbar-item">
                                <span>パスワード変更</span>
                                <form id="topnav-changepassword-form" method="POST" action="{{ route('admin-user-changepassword', ['user_id' => \Illuminate\Support\Facades\Auth::user()['id']]) }}"
                                    enctype="multipart/form-data">
                                    @csrf
                                </form>
                                <script type="text/javascript">
                                    window.addEventListener("load", function () {
                                        document.querySelector("#topnav-changepassword").addEventListener("click", function () {
                                            Swal.fire({
                                                title: "パスワード変更",
                                                html: "新しいパスワードを入力してください。<br/>（8文字以上）",
                                                icon: "info",
                                                input: "password",
                                                inputAttributes: {
                                                    minlength: 8,
                                                },
                                                showCancelButton: true,
                                            }).then(function (res) {
                                                if (res.isConfirmed) {
                                                    const pass = res.value;
                                                    const input = document.createElement("input");
                                                    input.value = pass;
                                                    input.name = "password";
                                                    const form = document.querySelector("#topnav-changepassword-form");
                                                    form.appendChild(input);
                                                    form.submit();
                                                }
                                            });
                                        });
                                    });
                                </script>
                            </a>
                            <a id="act-logout" class="navbar-item"
                                onclick="event.preventDefault(); document.querySelector('#act-logout-form').submit();">
                                <span>ログアウト
                                    <form id="act-logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                        @csrf
                                    </form>
                            </a>
                        </div> <!-- .navbar-dropdown -->
                    </div> <!-- .has-dropdown -->
                </div> <!-- .navbar-end -->
            </section>
            <script type="text/javascript">
                window.addEventListener("load", function () {
                    const menuactives = [
                        {
                            button: "#topnav-myname",
                            menu: "#topnav-endmenu",
                        },
                    ];
                    for(const menuactive of menuactives) {
                        document.querySelector(menuactive.button).addEventListener("click", function () {
                            const ele = document.querySelector(menuactive.menu);
                            ele.classList.toggle("is-active");
                            ele.classList.toggle("fadein");
                        });
                        document.querySelector(menuactive.button).addEventListener("touchend", function (ev) {
                            ev.preventDefault();
                            const ele = document.querySelector(menuactive.menu);
                            ele.classList.toggle("is-active");
                            ele.classList.toggle("fadein");
                        });
                    }
                });
            </script>
        </nav>
    </header>
    <main id="main" style="flex: 1;">
        <section id="main-header" class="hero is-primary">
            <div class="hero-body">
                <h1 class="title">@yield("labeltitle")</h1>
                <h2 class="subtitle">@yield("labelsubtitle")</h2>
            </div>
        </section>
        @include("message")
        <section id="contents-{{ Route::currentRouteName() }}" class="contents section">
            @yield("main")
        <section>
    </main>
    <footer id="footer" class="footer d-none-print">
        <section class="content has-text-centered">
            &copy; cranpun-lab
        </section>
    </footer>
</body>

</html>
