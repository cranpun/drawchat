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

    public function status()
    {
        $clcnt = count($this->clients);
        // $tokens = print_r($this->mapUserToken, true);
        $tokens = count($this->mapUserToken);

        $this->dp(<<< EOM
clcnt: {$clcnt}
tokens: {$tokens}
EOM);
    }

    public function detach(\Ratchet\ConnectionInterface $client): void
    {
        // clients, mapUserTokenから該当情報を削除
        $token = $this->clients->offsetGet($client);
        echo "detach {$token}" . PHP_EOL;
        unset($this->mapUserToken[$token]);
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($client);
    }

    use \App\Console\Commands\Ws\Server\WsServerTraitOnClose;
    use \App\Console\Commands\Ws\Server\WsServerTraitOnError;
    use \App\Console\Commands\Ws\Server\WsServerTraitOnMessage;
    use \App\Console\Commands\Ws\Server\WsServerTraitOnOpen;
}
