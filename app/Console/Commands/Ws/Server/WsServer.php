<?php

namespace App\Console\Commands\Ws\Server;

use Illuminate\Console\Command;

class DrawchatWSMessage
{
    public $ws_token;
    public $paper_id;
    public $draw;
    const CMD_UNDO = "[[[[UNDO]]]";

    public function __construct($json)
    {
        try {
            $data = json_decode($json);
            $this->ws_token = $data->ws_token;
            $this->paper_id = $data->paper_id;
            $this->draw = $data->draw;
        } catch (\Exception $e) {
            throw new \Exception("ws message : invalid format" . $e->getMessage());
        }
    }

    public function isUndo(): bool
    {
        return $this->draw == "[[[self]]]";
    }

    public static function getCmds(): array
    {
        // キーはJavascriptで扱いやすいもの
        return [
            "undo" => self::CMD_UNDO
        ];
    }
}

class WsServer implements \Ratchet\MessageComponentInterface
{
    protected \SplObjectStorage $clients;
    private array $mapUserToken;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
        $this->mapUserToken = [];
        $this->dp("start server...");
    }

    public function dp($s)
    {
        echo $s . PHP_EOL;
    }

    use \App\Console\Commands\Ws\Server\WsServerTraitOnClose;
    use \App\Console\Commands\Ws\Server\WsServerTraitOnError;
    use \App\Console\Commands\Ws\Server\WsServerTraitOnMessage;
    use \App\Console\Commands\Ws\Server\WsServerTraitOnOpen;
}
