<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="has-navbar-fixed-bottom">
<style type="text/css">
    html {
        transform-origin: top left;
        overflow-x: scroll;
    }
</style>

<head>
    @include("element/head")
    <title>{{ config("app.name") }}</title>
    <meta name="viewport" content="initial-scale=1 user-scalable=no">
    <script src="{{ asset('js/app.js') . '?v=' . filemtime(public_path() .'/js/app.js') }}" defer></script>
</head>

<?php
$cw = 340;
$ch = 1600;
?>

<body style="padding: 10px; display: inline-block;">
    <section id="serverdata" style="display: none;">
        <div id="sd-color">#00F</div>
    </section>
    <header id="toolbox">
        <nav class="navbar is-light is-fixed-bottom" role="navigation" aria-label="main navigation">
            <section class="navbar-brand">
                <a id="act-save" class="navbar-item">
                    <i class="fas fa-save"></i>
                </a>

                <div class="dropdown is-up">
                    <div class="dropdown-trigger navbar-item">
                        <a class="" aria-haspopup="true" aria-controls="dropdown-menu">
                            <span class="not-trigger">色</span>
                            <span class="icon is-small not-trigger">
                                <i class="fas fa-angle-up" aria-hidden="true"></i>
                            </span>
                        </a>
                    </div>
                    <div class="dropdown-menu" id="dropdown-menu" role="menu">
                        <div class="dropdown-content">
                            <a class="dropdown-item pen-color" style="background-color: #00F; color: white;">青</a>
                            <a class="dropdown-item pen-color" style="background-color: #F00; color: white;">赤</a>
                            <a class="dropdown-item pen-color" style="background-color: #0F0; color: white;">緑</a>
                        </div>
                    </div>
                </div>

                <a id="act-eraser" class="navbar-item has-background-light">
                    <i class="fas fa-eraser"></i>
                </a>

                <div class="dropdown is-up">
                    <div class="dropdown-trigger navbar-item">
                        <a class="" aria-haspopup="true" aria-controls="dropdown-menu">
                            <span id="zoom-label" class="not-trigger"></span>
                            <span class="icon is-small not-trigger">
                                <i class="fas fa-angle-up" aria-hidden="true"></i>
                            </span>
                        </a>
                    </div>
                    <div class="dropdown-menu" id="dropdown-menu" role="menu">
                        <div class="dropdown-content">
                            <a id="zoom-plus" class="dropdown-item">
                                <i class="fas fa-search-plus"></i>
                                <span>拡大</span>
                            <a>
                            <a id="zoom-minus" class="dropdown-item">
                                <i class="fas fa-search-minus"></i>
                                <span>縮小</span>
                            </a>
                        </div>
                    </div>
                </div>

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
                    <h2 class="navbar-item has-text-primary" data-testid="paper-{{ $paper->id }}">
                        {{ (\Carbon\Carbon::parse($paper->created_at))->format("Y-m-d") }}
                    </h2>
                    <a id="act-load-other-force" class="navbar-item">
                        読み込み
                    </a>
                    <a id="act-back" class="navbar-item">
                        一覧に戻る
                    </a>

                    <a id="act-undo" class="navbar-item" style="display: none">
                        <i class="fas fa-undo"></i>
                    </a>

                    <div class="navbar-item has-dropdown is-hoverable has-dropdown-up" style="display: none;">
                        <a class="navbar-link">
                            色
                        </a>

                        <div class="navbar-dropdown">
                            <span class="navbar-item" style="display: none;">
                                <div id="pen-color" class="picker" acp-palette="black|red|green|pink|skyblue" acp-palette-editable acp-show-rgb="no" acp-show-hsl="no" acp-show-hex="no"></div>
                                <style type="text/css">
                                    .picker {
                                        display: inline-block;
                                        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(3, 1, 1, 0.08);
                                        width: 100%;
                                    }
                                </style>
                            </span>
                        </div>
                    </div>
                </section>
            </section>
        </nav>
    </header>
    <!--  -->
    <main style="display: inline-block; transform-origin: top left; width: {{ $cw }}px; height: {{ $ch }}px; ">
        <style type="text/css">
            #drawcanvases {
                border: 3px solid #aaa;
                border-radius: 5px;
                transform-origin: top left;
                position: relative;
            }

            #drawcanvases,
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
            <canvas id="mycanvas" width="<?= $cw ?>" height="<?= $ch ?>" style="cursor: pointer;"></canvas>
            <canvas id="othercanvas" width="<?= $cw ?>" height="<?= $ch ?>" style="pointer-events: none;"></canvas>
        </div>
        <!-- <textarea id="prompt" style="width: 100%; height: 500px;"></textarea> -->
    </main>
    <footer>
    </footer>
</body>

</html>