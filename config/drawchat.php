<?php

return [
    'width' => env('DRAWCHAT_WIDTH', 320),
    'height' => env('DRAWCHAT_HEIGHT', 1600),
    'autoload_msec' => env('DRAWCHAT_AUTOLOAD_MSEC', 'Laravel', 3 * 1000),
    'autosave_msec' => env('DRAWCHAT_AUTOLOAD_MSEC', 'Laravel', 3 * 1000),
    "ws" => [
        'url' => env('wss://' . parse_url(env("APP_URL", "https://dev.dev.ll"))["host"] . "/ws", "wss://dev.dev.ll/ws"),
        'token_limit_msec' => env('DRAWCHAT_WS_TOKEN_LIMIT_MSEC', 30 * 1000),
        'port' => env('DRAWCHAT_WS_PORT', 8000),
    ]
];