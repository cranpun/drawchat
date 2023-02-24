<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="has-navbar-fixed-bottom">

<head>
    @include('head')
    <meta name="viewport" content="initial-scale=1 user-scalable=no">
    <script type="text/javascript" src="{{ \App\U\U::publicfiletimelink('js/app.js') }}"></script>
    <link type="text/css" rel="stylesheet" href="{{ \App\U\U::publicfiletimelink('css/draw.css') }}">
    <title>drawchat</title>
</head>

<?php
$cw = config('drawchat.width');
$ch = config('drawchat.height');
$defcolor = '#00F';
$defthick = 6;
$ws_consts = '';
foreach (\App\U\DrawchatWSMessage::getCmds() as $key => $val) {
    $ws_consts .= "['{$key}', '{$val}'],";
}
?>

<body style="padding: 10px; display: inline-block;">
    <script type="text/javascript">
        window.addEventListener("load", async () => {
            const params = {
                width: {{ $cw }},
                height: {{ $ch }},
                color: "{{ $defcolor }}",
                thick: {{ $defthick }},
                created_at: "{{ $created_at }}",
                csrf_token: "{{ csrf_token() }}",
                paper_id: {{ $paper->id }},
                ws: {
                    url: "{{ config('drawchat.ws.url') }}",
                    token: "{{ $ws_token }}",
                    cmds: new Map([{!! $ws_consts !!}])
                }
            };
            drawchat.main(params);
        });
    </script>
    <header id="toolbox">
        <nav class="navbar is-light is-fixed-bottom" role="navigation" aria-label="main navigation">
            @include('admin.paper.draw.menu')
        </nav>
    </header>
    <!--  -->
    <main style="display: inline-block; transform-origin: top left; width: {{ $cw }}px;">
        <style type="text/css">
            #drawcanvases {
                width: <?=$cw + 10 ?>px;
                height: <?=$ch + 30 ?>px;
            }

            #canvas-drawing,
            #canvas-drawn {
                width: <?=$cw ?>px;
                height: <?=$ch ?>px;
            }
        </style>
        <div id="drawcanvases" style="margin-bottom: 5vh;">
            <canvas id="canvas-drawn" width="<?= $cw ?>" height="<?= $ch ?>" style="pointer-events: none;"></canvas>
            <canvas id="canvas-drawing" width="<?= $cw ?>" height="<?= $ch ?>" style="cursor: pointer;"></canvas>
        </div>
        <!-- <textarea id="prompt" style="width: 100%; height: 500px;"></textarea> -->
    </main>
    <footer>
    </footer>
</body>

</html>
