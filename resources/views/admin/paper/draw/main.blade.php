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
$defcolor = '#000';
$defthick = 6;
$ws_cmds_server = '';
foreach (\App\U\DrawchatWSMessageToServer::getCmds() as $key => $val) {
    $ws_cmds_server .= "['{$key}', '{$val}'],";
}
$ws_cmds_client = '';
foreach (\App\U\DrawchatWSMessageToClient::getCmds() as $key => $val) {
    $ws_cmds_client .= "['{$key}', '{$val}'],";
}
?>

<body style="padding: 10px; display: inline-block;">
    <script type="text/javascript">
        window.addEventListener("load", async () => {
            const params = {
                user_id: {{ \Illuminate\Support\Facades\Auth::user()->id }},
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
                    cmds: {
                        server: new Map([{!! $ws_cmds_server !!}]),
                        client: new Map([{!! $ws_cmds_client !!}])
                    }
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

            #canvas-info,
            #canvas-drawing,
            #canvas-drawn {
                width: <?=$cw ?>px;
                height: <?=$ch ?>px;
            }
        </style>
        <div id="drawcanvases" style="margin-bottom: 5vh; {{ $paper->background_attr }} background-size: auto 100%; background-repeat: no-repeat; width: {{ $cw }}px;">
            <canvas id="canvas-drawn" width="<?= $cw ?>" height="<?= $ch ?>" style="pointer-events: none;"></canvas>
            <canvas id="canvas-drawing" width="<?= $cw ?>" height="<?= $ch ?>" style="cursor: pointer;"></canvas>
            <canvas id="canvas-info" width="<?= $cw ?>" height="<?= $ch ?>" style="pointer-events: none;"></canvas>
        </div>
        <!-- <textarea id="prompt" style="width: 100%; height: 500px;"></textarea> -->
    </main>
    <footer>
    </footer>
</body>

</html>
