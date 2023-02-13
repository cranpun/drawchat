<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="has-navbar-fixed-bottom">
<style type="text/css">
    html {
        transform-origin: top left;
        overflow-x: scroll;
    }

    .material-icons-parent,
    .material-icons-parent span {
        vertical-align: middle;
    }
</style>

<head>
    @include("head")
    <meta name="viewport" content="initial-scale=1 user-scalable=no">
    <script type="text/javascript" src="{{ \App\U\U::publicfiletimelink('js/app.js') }}"></script>
</head>

<?php
$cw = 320;
$ch = 1600;
$defcolor = "#00F";
$defthick = 6;
?>

<body style="padding: 10px; display: inline-block;">
    <section id="serverdata" style="display: none;">
        <div id="sd-csrf-token">{{ csrf_token() }}</div>
        <div id="sd-color">{{ $defcolor }}</div>
        <div id="sd-thick">{{ $defthick }}</div>
        <div id="sd-cw">{{ $cw }}</div>
        <div id="sd-ch">{{ $ch }}</div>
        <div id="sd-created_at">{{ $created_at }}</div>
    </section>
    <header id="toolbox">
        <nav class="navbar is-light is-fixed-bottom" role="navigation" aria-label="main navigation">
            @include("admin.paper.draw.menu")
        </nav>
    </header>
    <!--  -->
    <main style="display: inline-block; transform-origin: top left; width: {{ $cw }}px;">
        <style type="text/css">
            #drawcanvases {
                border-radius: 5px;
                transform-origin: top left;
                position: relative;
                padding: 3px;
                width: <?= $cw + 10 ?>px;
                height: <?= $ch + 30 ?>px;
            }

            #canvas-drawing,
            #canvas-drawstore {
                border: 5px solid #aaa;
                width: <?= $cw ?>px;
                height: <?= $ch ?>px;
            }

            #canvas-drawing,
            #canvas-drawstore {
                position: absolute;
                top: 0;
                left: 0;
            }
        </style>
        <div id="drawcanvases" style="margin-bottom: 5vh;">
            <canvas id="canvas-drawstore" width="<?= $cw ?>" height="<?= $ch ?>" style="pointer-events: none;"></canvas>
            <canvas id="canvas-drawing" width="<?= $cw ?>" height="<?= $ch ?>" style="cursor: pointer;"></canvas>
        </div>
        <!-- <textarea id="prompt" style="width: 100%; height: 500px;"></textarea> -->
    </main>
    <footer>
    </footer>
</body>

</html>