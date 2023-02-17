<?php

namespace App\Console\Commands\Ws;

use Illuminate\Console\Command;

class Start extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'Ws:Start';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $server = \Ratchet\Server\IoServer::factory(
            new \Ratchet\Http\HttpServer(
                new \Ratchet\WebSocket\WsServer(
                    new \App\Console\Commands\Ws\Server\WsServer()
                )
            ),
            config("drawchat.ws.port")
        );

        $server->run();

        return Command::SUCCESS;
    }
}
