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

            if ($data->cmd == \App\U\DrawchatWSMessage::CMD_REGISTER) {
                echo "your Join" . PHP_EOL;
                $text = $this->onMessage_makeDrawJson($data);
                $this->onMessage_sendOnly($text, $from);
            } else {
                if ($data->cmd == \App\U\DrawchatWSMessage::CMD_DRAW) {
                    $this->onMessage_save($user, $data);
                } else if ($data->cmd == \App\U\DrawchatWSMessage::CMD_UNDO) {
                    $this->onMessage_undo($user, $data);
                }
                $text = $this->onMessage_makeDrawJson($data);
                $this->onMessage_sendAll($text);
            }
        } catch (\Exception $e) {
            $from->send($e->getMessage());
        }
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
    private function onMessage_getUser(\Ratchet\ConnectionInterface $from, \App\U\DrawchatWSMessage $data): \App\Models\User
    {
        // 一応、WebSocketがOpenしているか確認
        if (!$this->clients->contains($from)) {
            throw \Exception("ws : not have this connection");
        }

        // 認証しつつUserを取得
        if (array_key_exists($data->ws_token, $this->mapUserToken)) {
            $user = $this->mapUserToken[$data->ws_token];
        } else {
            if ($data->cmd !== \App\U\DrawchatWSMessage::CMD_REGISTER) {
                throw \Exception("ws : getUser : ill cmd ({$data->cmd}). please " . \App\U\DrawchatWSMessage::CMD_REGISTER);
            }
            // 初メッセージなのでトークンを保存
            $user = \App\Models\User::loadByWsToken($data->ws_token);
            $this->mapUserToken[$data->ws_token] = $user;
        }
        $this->status();
        return $user;
    }

    private function onMessage_save(\App\Models\User $user, \App\U\DrawchatWSMessage $data): void
    {
        // データの保存処理
        // 連続で書き込みがある場合があるため、transaction
        \Illuminate\Support\Facades\DB::transaction(function () use ($user, $data) {
            $draw = \App\Models\Draw::firstOrNew([
                "user_id" => $user->id,
                "paper_id" => $data->paper_id
            ]);
            $stroke = $data->draw;
            // // 先頭末尾にダブルクォートが入ってしまうので除去
            // $len = mb_strlen($stroke);
            // $stroke = mb_substr(mb_substr($stroke, $len - 1, 1), 0, 1);
            // echo $stroke . PHP_EOL;
            if ($draw->json_draw && strlen($draw->json_draw) > 0) {
                // 2回目以降のデータなので末尾に追加
                $draw->json_draw = $draw->json_draw . "," . $stroke;
            } else {
                // 1回目なので諸々データを保存
                $draw->user_id = $user->id;
                $draw->paper_id = $data->paper_id;
                $draw->json_draw = $stroke;
            }
            $draw->save();
        });
    }

    private function onMessage_undo(\App\Models\User $user, \App\U\DrawchatWSMessage $data): void
    {
        // websocket対応のため、transaction
        \Illuminate\Support\Facades\DB::transaction(function () use ($user, $data) {
            // 自分のレコードを取得
            $q = \App\Models\Draw::query();
            $q->where("user_id", "=", $user->id);
            $q->where("paper_id", "=", $data->paper_id);
            $row = $q->first();
            if(!$row) {
                // まだ一度も記述していない
                return;
            }

            // 最後のdrawを除去。
            $delm = "]]],"; // かっこ3個はstrokeの終わりのみ
            $strokes = explode($delm, $row->json_draw);
            if (count($strokes) <= 1) {
                // 最後のデータなので空欄
                $row->delete();
            } else {
                array_pop($strokes);
                $newstrokes = join($delm, $strokes) . "]]]"; // デリミタの都合で消されるので追加
                $row->json_draw = $newstrokes;
                $row->save();
            }
        });
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

    private function onMessage_sendOnly(string $text, \Ratchet\ConnectionInterface $from): void
    {
        if ($text && strlen($text)) {
            $from->send($text);
        }
    }

    private function onMessage_sendAll(string $text): void
    {
        echo "send all" . PHP_EOL;
        foreach ($this->clients as $client) {
            // The sender is not the receiver, send to each client connected
            $this->onMessage_sendOnly($text, $client);
        }
    }

    private function onMessage_makeDrawJson(\App\U\DrawchatWSMessage $data): string
    {
        // ユーザごとに分けたレコードを集めて結合
        // ソートはjsonの都合上、ローカルでやる必要があるのでここではしない
        $q = \App\Models\Draw::query();
        $q->where("paper_id", "=", $data->paper_id);
        $rows = $q->get();
        if (!$rows) {
            // データがないので何もしない
            return "";
        }

        $draws = [];
        foreach ($rows as $row) {
            $draws[] = $row->json_draw;
        }
        // 配列の中身だけで保存しているため、くくるためのかっこを追加。末尾にカンマがついてないのでそれもあわせて
        $json = "[" . join(",", $draws) . "]";

        return $json;
    }
}
