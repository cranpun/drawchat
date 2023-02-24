<?php

namespace App\Console\Commands\Tmp;

use Illuminate\Console\Command;

class Tmp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'Tmp:Tmp';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'MYTODO 旧json_drawを新しい形式に変換するコマンド';

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
