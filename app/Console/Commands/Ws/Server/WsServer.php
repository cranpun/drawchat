<?php

namespace App\Console\Commands\Ws\Server;

use Illuminate\Console\Command;

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
