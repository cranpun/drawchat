<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" style="transform-origin: top left;">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="initial-scale=1">

        <title>{{ config("app.name") }}</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
        <link rel="shortcut icon" href="https://tm.cranpun-tool.ml/wp-content/themes/themeorg/favicon.ico" />

        <!-- Styles -->
        <style>
            html, body {
                background-color: #fff;
                color: #636b6f;
                font-family: 'Nunito', sans-serif;
                font-weight: 200;
                margin: 0;
            }

            .content {
                text-align: center;
            }

            .title {
                font-size: 84px;
            }

            .links > a {
                color: #636b6f;
                padding: 0 25px;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: .1rem;
                text-decoration: none;
                text-transform: uppercase;
            }

            .m-b-md {
                margin-bottom: 30px;
            }
        </style>
        <script src="{{ asset('js/app.js') . '?v=' . filemtime(public_path() .'/js/app.js') }}" defer></script>
    </head>
    <body>
        <div class="">
            @if (Route::has('login'))
                <div class="top-right links">
                    @auth
                        <a href="{{ url('/home') }}">Home</a>
                    @else
                        <a href="{{ route('login') }}">Login</a>

                        @if (Route::has('register'))
                            <a href="{{ route('register') }}">Register</a>
                        @endif
                    @endauth
                </div>
            @endif

            <div>
                <div class="title m-b-md">
                    paper {{ $paper_id }}
                </div>
                <style type="text/css">
                    <?php $cw = 2200; $ch = 1600; ?>
                    #drawcanvases {
                        margin-bottom: 15px;
                        border: 3px solid #aaa;
                        border-radius: 5px;
                    }
                    #drawcanvases, #mycanvas, #othercanvas {
                        width: <?= $cw ?>px;
                        height: <?= $ch ?>px;
                    }
                    #mycanvas, #othercanvas {
                        position: absolute;
                        top: 0;
                        left: 0;
                    }
                </style>
                <div id="drawcanvases" style="position: relative">
                    <canvas id="othercanvas" width="<?= $cw ?>" height="<?= $ch ?>"></canvas>
                    <canvas id="mycanvas" width="<?= $cw ?>" height="<?= $ch ?>"></canvas>
                </div>

                <div class="links">
                    <a href="/">戻る</a>
                    <button id="bt-save">保存</button>
                    <button id="bt-load" style="display: none">ロード</button>
                </div>
            </div>
        </div>
    </body>
</html>
