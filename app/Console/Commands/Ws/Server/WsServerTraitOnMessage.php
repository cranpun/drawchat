<?php

namespace App\Console\Commands\Ws\Server;

trait WsServerTraitOnMessage
{
    public function onMessage(\Ratchet\ConnectionInterface $from, $msg)
    {

        try {
            // 接続の安全性の確認
            $data = new \App\U\DrawchatWSMessage($msg);
            $user = $this->onMessage_getUser($from, $data);
            $draw = $this->onMessage_saveDraw($user, $data);
            $this->onMessage_sendOther($from, $draw);
        } catch (\Exception $e) {
            $from->send($e->getMessage());
        }
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
    private function onMessage_getUser(\Ratchet\ConnectionInterface $from, \App\U\DrawchatWSMessage $data): \App\Models\User
    {
        if (!$this->clients->contains($from)) {
            throw \Exception("ws : not have this connection");
        }
        if (array_key_exists($data->ws_token, $this->mapUserToken)) {
            $user = $this->mapUserToken[$data->ws_token];
        } else {
            // 初メッセージなのでトークンを保存
            $user = \App\Models\User::loadByWsToken($data->ws_token);
            $this->mapUserToken[$data->ws_token] = $user;
        }
        return $user;
    }

    private function onMessage_saveDraw(\App\Models\User $user, \App\U\DrawchatWSMessage $data): \App\Models\Draw
    {
        // データの保存処理
        $draw = \App\Models\Draw::firstOrNew([
            "user_id" => $user->id,
            "paper_id" => $data->paper_id
        ]);
        if($draw->json_draw && strlen($draw->json_draw) > 0) {
            // 2回目以降のデータなので末尾に追加
            $newarr = json_decode($data->draw);
            $nowarr = json_decode($draw->json_draw);
            $resarr = array_merge($nowarr, $newarr);
            $draw->json_draw = json_encode($resarr);
            $draw->save();
        }
        return $draw;
    }

    private function onMessage_prompt(): void
    {
            // $numRecv = count($this->clients) - 1;
            // $this->dp(
            //     'Connection [%s](%d) sending message "%s" to %d other connection%s',
            //     $user->name,
            //     $from->resourceId,
            //     $data["data"],
            //     $numRecv,
            //     $numRecv == 1 ? '' : 's'
            // );

    }

    private function onMessage_sendOther(\Ratchet\ConnectionInterface $from, \App\Models\Draw $draw): void
    {
        foreach ($this->clients as $client) {
            if ($from !== $client) {
                // The sender is not the receiver, send to each client connected
                $client->send($draw->json_draw);
            }
        }
    }
}
