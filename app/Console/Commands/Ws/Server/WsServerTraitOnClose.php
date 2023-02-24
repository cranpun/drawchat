<?php

namespace App\Console\Commands\Ws\Server;

trait WsServerTraitOnClose
{
    public function onClose(\Ratchet\ConnectionInterface $conn)
    {
        $this->detach($conn);

    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}
