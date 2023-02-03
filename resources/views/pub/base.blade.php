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
            <span class="navbar-item">
                <a id="topnav-pub-top" href="{{ route('top') }}">drawchat</a>
            </span>
        </section>
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