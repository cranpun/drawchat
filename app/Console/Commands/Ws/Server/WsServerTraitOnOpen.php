<?php

namespace App\Console\Commands\Ws\Server;

trait WsServerTraitOnOpen
{

    public function onOpen(\Ratchet\ConnectionInterface $conn)
    {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);
        // $user = \illuminate\Support\Facades\Auth::user();
        // $ret = $user == null ? "true" : "false";
        $user = \App\Models\User::find(1);
        $ret = $user->name;
        $this->dp("New connection! ({$conn->resourceId}) {$ret}");
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
}
