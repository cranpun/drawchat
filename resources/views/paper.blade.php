<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" style="transform-origin: top left; overflow-x: scroll;">

<head>
    @include("element/head")
    <title>{{ config("app.name") }}</title>
    <script src="{{ asset('js/app.js') . '?v=' . filemtime(public_path() .'/js/app.js') }}" defer></script>
</head>

<body style="padding: 10px; display: inline-block;">
    <header style="position: fixed; z-index: 999;">
        <nav class="navbar is-light" role="navigation" aria-label="main navigation">
            <section class="navbar-brand">
                <h2 class="navbar-item has-text-primary" data-testid="paper-{{ $paper_id }}">
                    paper {{ $paper_id }}
                </h2>
                <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
                    data-target="navbarPaper">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </section>

            <section id="navbarPaper" class="navbar-menu">
                <div class="navbar-start">
                    <a id="bt-save" class="navbar-item">
                        保存
                    </a>

                    <a class="navbar-item" href="/">
                        戻る
                    </a>

                    <div class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link">
                            ツール
                        </a>

                        <div class="navbar-dropdown">
                            <span class="navbar-item">

                            </span>
                            <hr class="navbar-divider">
                            <span class="navbar-item">
                                Report an issue
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </nav>
    </header>
    <main style="padding-top: 55px;">
        <style type="text/css">
            <?php $cw = 2200; $ch = 1600;?>
            #drawcanvases {
                border: 3px solid #aaa;
                border-radius: 5px;
                transform-origin: top left;
                position: relative;
            }

            #drawcanvases,
            #mycanvas,
            #othercanvas {
                width: <?=$cw?>px;
                height: <?=$ch?>px;
            }

            #mycanvas,
            #othercanvas {
                position: absolute;
                top: 0;
                left: 0;
            }
        </style>
        <div id="drawcanvases">
            <canvas id="othercanvas" width="<?=$cw?>" height="<?=$ch?>"></canvas>
            <canvas id="mycanvas" width="<?=$cw?>" height="<?=$ch?>"></canvas>
        </div>
        <textarea id="prompt" style="width: 100%; height: 500px;"></textarea>
    </main>
    <footer></footer>
</body>

</html>