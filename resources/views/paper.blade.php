<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="has-navbar-fixed-bottom">
<style type="text/css">
    html {
        transform-origin: top left;
        overflow-x: scroll;
    }
    .material-icons-parent, .material-icons-parent span {
        vertical-align: middle;
    }
</style>

<head>
    @include("element/head")
    <title>{{ config("app.name") }}</title>
    <meta name="viewport" content="initial-scale=1 user-scalable=no">
    <script src="{{ asset('js/app.js') . '?v=' . filemtime(public_path() .'/js/app.js') }}" defer></script>
</head>

<?php
$cw = 320;
$ch = 1600;
$defcolor = "#00F";
$defthick = 6;
?>

<body style="padding: 10px; display: inline-block;">
    <section id="serverdata" style="display: none;">
        <div id="sd-color">{{ $defcolor }}</div>
        <div id="sd-thick">{{ $defthick }}</div>
        <div id="sd-cw">{{ $cw }}</div>
        <div id="sd-ch">{{ $ch }}</div>
        <div id="sd-created_at">{{ $created_at }}</div>
    </section>
    <header id="toolbox">
        <nav class="navbar is-light is-fixed-bottom" role="navigation" aria-label="main navigation">
            <section class="navbar-brand">
                <div id="color-dropdown" class="dropdown is-up">
                    <div class="dropdown-trigger navbar-item">
                        <a class="" aria-haspopup="true" aria-controls="dropdown-menu">
                            <span id="color-label" class="not-trigger material-icons-parent" style="color: {{ $defcolor }}" alt="色">
                                <span class="material-icons">edit</span>
                            </span>
                            <span class="icon is-small not-trigger material-icons-parent">
                                <span class="material-icons" aria-hidden="true">arrow_drop_up</span>
                            </span>
                        </a>
                    </div>
                    <div class="dropdown-menu" id="dropdown-menu" role="menu">
                        <div class="dropdown-content">
                            <?php foreach($colors as $color) : ?>
                                <a class="dropdown-item pen-color" style="background-color: {{ $color['color'] }}; color: {{ $color['labelcolor'] }};">{{ $color['label'] }}</a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>

                <div id="thick-dropdown" class="dropdown is-up">
                    <div class="dropdown-trigger navbar-item">
                        <a class="" aria-haspopup="true" aria-controls="dropdown-menu">
                            <span id="thick-label" class="not-trigger" style="background: black; display: inline-block; width: {{ $defthick }}px; height: {{ $defthick }}px; border-radius: {{ $defthick / 2 }}px; vertical-align: middle;" alt="太さ">
                                &nbsp;
                            </span>
                            <span class="icon is-small not-trigger material-icons-parent">
                                <span class="material-icons" aria-hidden="true" style="vertical-align: bottom;">arrow_drop_up</span>
                            </span>
                        </a>
                    </div>
                    <div class="dropdown-menu" id="dropdown-menu" role="menu">
                        <div class="dropdown-content">
                            <?php foreach($thicks as $thick) : $half = $thick['thick'] / 2; ?>
                                <a
                                    class="dropdown-item pen-thick"
                                    data-width="{{ $thick['thick'] }}$"
                                >
                                    <span
                                        class="not-trigger"
                                        style="background-color: #000; width: {{ $thick['thick'] }}px; height: {{ $thick['thick'] }}px; border-radius: {{ $half }}px; display: inline-block;">&nbsp;</span>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>

                <a id="act-eraser" class="navbar-item has-background-light" style="display: none;">
                    <i class="fas fa-eraser"></i>
                </a>

                <div id="move-dropdown" class="dropdown is-up">
                    <div class="dropdown-trigger navbar-item">
                        <a class="" aria-haspopup="true" aria-controls="dropdown-menu">
                            <span class="icon is-small not-trigger material-icons-parent">
                                <span class="material-icons" aria-hidden="true">zoom_out_map</span>
                            </span>
                        </a>
                    </div>
                    <div class="dropdown-menu" role="menu">
                        <div class="dropdown-content" style="background: rgba(0, 255, 0, 0.3); border-radius: 15px;">
                            <span class="dropdown-item">
                                <div id="move-pad" style="width: 150px; height: 150px; "></div>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="dropdown is-up">
                    <div class="dropdown-trigger navbar-item">
                        <a class="" aria-haspopup="true" aria-controls="dropdown-menu">
                            <span class="icon is-small not-trigger material-icons-parent">
                                <span class="material-icons" aria-hidden="true">loupe</span>
                            </span>
                            <span id="zoom-label" class="not-trigger"></span>
                            <span class="icon is-small not-trigger material-icons-parent">
                                <span class="material-icons" aria-hidden="true">arrow_drop_up</span>
                            </span>
                        </a>
                    </div>
                    <div class="dropdown-menu" id="dropdown-menu" role="menu">
                        <div class="dropdown-content">
                            <a id="zoom-plus" class="dropdown-item material-icons-parent">
                                <span class="material-icons" aria-hidden="true">zoom_in</span>
                                <span>拡大</span>
                            <a>
                            <a id="zoom-minus" class="dropdown-item material-icons-parent">
                                <span class="material-icons" aria-hidden="true">zoom_out</span>
                                <span>縮小</span>
                            </a>
                        </div>
                    </div>
                </div>

                <a id="act-eraser" class="navbar-item has-background-light" style="display: none;">
                    <i class="fas fa-eraser"></i>
                </a>

                <a id="toolbox-burger" role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="toolbox">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>

                <script type="text/javascript">
                    window.addEventListener("load", function() {
                        const burger = document.querySelector("#toolbox-burger");
                        const active = function() {
                            const menu = document.querySelector("#toolbox-menu");
                            menu.classList.toggle("is-active");
                            burger.classList.toggle("is-active");
                        }
                        burger.addEventListener("click", active);
                        burger.addEventListener("touchend", active);
                    });
                </script>
            </section>

            <section id="toolbox-menu" class="navbar-menu">
                <section class="navbar-start">
                </section>
                <section class="navbar-end">
                    <a id="act-save" class="navbar-item material-icons-parent">
                        <span class="material-icons" aria-hidden="true">save</span>
                        &nbsp;(<span id="label-save">saved</span>)
                    </a>

                    <a id="act-download" class="navbar-item material-icons-parent">
                        <span class="material-icons" aria-hidden="true">download</span>
                        &nbsp;(<span id="label-download"></span>)
                    </a>
                    <a id="act-new-paper" class="navbar-item material-icons-parent" href="{{ route('open-paper') }}">
                        <span class="material-icons" aria-hidden="true">file_open</span>
                        &nbsp;new
                    </a>
                    <a id="act-load-other-force" class="navbar-item" style="display: none;">
                        読み込み
                    </a>
                    <a id="act-back" class="navbar-item material-icons-parent">
                        <span class="material-icons" aria-hidden="true">low_priority</span>
                        &nbsp;一覧へ
                    </a>

                    <a id="act-undo" class="navbar-item" style="display: none">
                        <i class="fas fa-undo"></i>
                    </a>
                </section>
            </section>
        </nav>
    </header>
    <!--  -->
    <main style="display: inline-block; transform-origin: top left; width: {{ $cw }}px; height: {{ $ch }}px; ">
        <style type="text/css">
            #drawcanvases {
                border: 5px solid #aaa;
                border-radius: 5px;
                transform-origin: top left;
                position: relative;
                padding: 3px;
                width: {{ $cw + 10 }}px;
                height: {{ $ch + 10 }}px;
            }

            #mycanvas,
            #othercanvas {
                width: <?= $cw ?>px;
                height: <?= $ch ?>px;
            }

            #mycanvas,
            #othercanvas {
                position: absolute;
                top: 0;
                left: 0;
            }
        </style>
        <div id="drawcanvases">
            <canvas id="othercanvas" width="<?= $cw ?>" height="<?= $ch ?>" style="pointer-events: none;"></canvas>
            <canvas id="mycanvas" width="<?= $cw ?>" height="<?= $ch ?>" style="cursor: pointer;"></canvas>
        </div>
        <!-- <textarea id="prompt" style="width: 100%; height: 500px;"></textarea> -->
    </main>
    <footer>
    </footer>
</body>

</html>
