<?php

namespace App\Console\Commands\Ws\Server;

trait WsServerTraitOnError
{
    public function onError(\Ratchet\ConnectionInterface $conn, \Exception $e)
    {
        $this->dp("An error has occurred: {$e->getMessage()}");
        $this->detach($conn);
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}
