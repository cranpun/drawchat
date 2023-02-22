<?php

namespace App\Console\Commands\Ws\Server;

trait WsServerTraitOnOpen
{

    public function onOpen(\Ratchet\ConnectionInterface $conn)
    {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);
        $this->dp("New connection! ({$conn->resourceId})");
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}
