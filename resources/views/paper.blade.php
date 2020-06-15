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
$cw = 2200;
$ch = 1600;
?>
<body style="padding: 10px; display: inline-block;">
    <section id="serverdata" style="display: none;">
        <!-- MYTODO serverからのデータ -->
        <div id="sd-color">#00F</div>
    </section>
    <header id="toolbox">
        <nav class="navbar is-light is-fixed-bottom" role="navigation" aria-label="main navigation">
            <section class="navbar-brand">
                <h2 class="navbar-item has-text-primary" data-testid="paper-{{ $paper_id }}">
                    paper {{ $paper_id }}
                </h2>
                <a id="act-back" class="navbar-item" href="/">
                    戻る
                </a>

                <a id="act-save" class="navbar-item">
                    保存
                </a>

                <span class="navbar-item">
                    <button id="act-eraser" class="button is-small is-light">
                    <i class="fas fa-eraser"></i>
                    </button>
                </span>

                <span id="zoomscroll" class="navbar-item">
                    <span style="padding: 0px 5px;">
                        <span id="zoom-label"></span>
                    </span>
                    <span class="field has-addons buttons are-small">
                        <span class="control">
                            <button id="zoom-minus" class="button">
                            <i class="fas fa-search-minus"></i>
                            </button>
                        </span>
                        <span class="control">
                            <button id="zoom-plus" class="button">
                            <i class="fas fa-search-plus"></i>
                            </button>
                        </span>
                    </span>
                </span>
                <a id="toolbox-burger" role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
                    data-target="navbarPaper">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <script type="text/javascript">
                    window.addEventListener("load", function() {
                        const burger = document.querySelector("#toolbox-burger");
                        const active = function() {
                            const menu = document.querySelector("#navbarPaper");
                            menu.classList.toggle("is-active");
                            burger.classList.toggle("is-active");
                        }
                        burger.addEventListener("click", active);
                        burger.addEventListener("touchend", active);
                    });
                    </script>
                </a>
            </section>

            <section id="navbarPaper" class="navbar-menu">
                <div class="navbar-start">
                    <div class="navbar-item has-dropdown is-hoverable has-dropdown-up">
                        <a class="navbar-link">
                            ツール
                        </a>

                        <div class="navbar-dropdown">
                            <span class="navbar-item">
                                <div
                                    id="pen-color"
                                    class="picker"
                                    acp-palette="black|red|green|pink|skyblue"
                                    acp-palette-editable
                                    acp-show-rgb="no"
                                    acp-show-hsl="no"
                                    acp-show-hex="no"
                                ></div>
                                <style type="text/css">
                                .picker {
                                    display: inline-block;
                                    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(3, 1, 1, 0.08);
                                    width: 100%;
                                }
                                </style>
                            </span>
                            <span class="navbar-item">
                                submenu
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
            <canvas id="mycanvas" width="<?=$cw?>" height="<?=$ch?>" style="cursor: pointer;"></canvas>
            <canvas id="othercanvas" width="<?=$cw?>" height="<?=$ch?>" style="pointer-events: none;"></canvas>
        </div>
        <!-- <textarea id="prompt" style="width: 100%; height: 500px;"></textarea> -->
    </main>
    <footer>
    </footer>
</body>

</html>