<?php

namespace App\Console\Commands\Ws\Server;

trait WsServerTraitOnClose
{
    public function onClose(\Ratchet\ConnectionInterface $conn)
    {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);

        $this->dp("Connection {$conn->resourceId} has disconnected");
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}
