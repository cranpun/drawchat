<?php

namespace App\Console\Commands\Ws\Server;

trait WsServerTraitOnMessage
{
    public function onMessage(\Ratchet\ConnectionInterface $from, $msg)
    {
        try {
            // 接続の安全性の確認
            $data = new \App\U\DrawchatWSMessageToServer($msg);
            $user = $this->onMessage_getUser($from, $data);

            $sendOnlyCmds = [
                \App\U\DrawchatWSMessageToServer::CMD_REGISTER,
            ];
            $sendOnlyCmds = [
                \App\U\DrawchatWSMessageToServer::CMD_REGISTER,
            ];

            if($data->cmd == \App\U\DrawchatWSMessageToServer::CMD_PAPERBG) {
                $paper = \App\Models\Paper::find($data->paper_id);
                $paper->background = $data->draw;
                $paper->save();

                $cmd = \App\U\DrawchatWSMessageToClient::CMD_RELOAD;
                $mes = new \App\U\DrawchatWSMessageToClient($cmd, "はいけいがぞうをかえました。くるくるでよみこみしてね。");
                $this->onMessage_sendAll($mes->json());
            } else if ($data->cmd == \App\U\DrawchatWSMessageToServer::CMD_POS) {
                // これだけdrawを送らないので特別対応
                $pack = new \App\U\DrawchatWSMessageToClient(\App\U\DrawchatWSMessageToClient::CMD_POS, $data->draw);
                $this->onMessage_sendAll($pack->json());
            } else if (in_array($data->cmd, $sendOnlyCmds)) {
                if ($data->cmd == \App\U\DrawchatWSMessageToServer::CMD_REGISTER) {
                    $this->onMessage_prompt("your Join {$user->display_name}");
                    $text = $this->onMessage_makeDrawJson($data);
                    $cmd = \App\U\DrawchatWSMessageToClient::CMD_DRAW;
                }
                $mes = new \App\U\DrawchatWSMessageToClient($cmd, $text);
                $json = $mes->json();
                $this->onMessage_sendOnly($json, $from);
            } else {
                // 全員に返信
                if ($data->cmd == \App\U\DrawchatWSMessageToServer::CMD_DRAW) {
                    $this->onMessage_save($user, $data);
                } else if ($data->cmd == \App\U\DrawchatWSMessageToServer::CMD_UNDO) {
                    $this->onMessage_undo($user, $data);
                }
                $text = $this->onMessage_makeDrawJson($data);
                $cmd = \App\U\DrawchatWSMessageToClient::CMD_DRAW;
                $mes = new \App\U\DrawchatWSMessageToClient($cmd, $text);
                $json = $mes->json();
                $this->onMessage_sendAll($json);
            }
        } catch (\Exception $e) {
            $from->send($e->getMessage());
        }
    }

    // *************************************
    // utils : 衝突を避けるため、action名_メソッド名とすること
    // *************************************
    private function onMessage_getUser(\Ratchet\ConnectionInterface $from, \App\U\DrawchatWSMessageToServer $data): \App\Models\User
    {
        // 一応、WebSocketがOpenしているか確認
        if (!$this->clients->contains($from)) {
            throw \Exception("ws : not have this connection");
        }

        // 認証しつつUserを取得
        if (array_key_exists($data->ws_token, $this->mapUserToken)) {
            $user = $this->mapUserToken[$data->ws_token];
        } else {
            if ($data->cmd !== \App\U\DrawchatWSMessageToServer::CMD_REGISTER) {
                throw \Exception("ws : getUser : ill cmd ({$data->cmd}). please " . \App\U\DrawchatWSMessageToServer::CMD_REGISTER);
            }
            // 初メッセージなのでトークンを保存
            $user = \App\Models\User::loadByWsToken($data->ws_token);
            $this->mapUserToken[$data->ws_token] = $user;
            $this->clients->offsetSet($from, $data->ws_token);
        }
        $this->status();
        return $user;
    }

    private function onMessage_save(\App\Models\User $user, \App\U\DrawchatWSMessageToServer $data): void
    {
        // データの保存処理
        // 連続で書き込みがある場合があるため、transaction
        \Illuminate\Support\Facades\DB::transaction(function () use ($user, $data) {
            $draw = \App\Models\Draw::firstOrNew([
                "user_id" => $user->id,
                "paper_id" => $data->paper_id
            ]);
            $stroke = $data->draw;

            // 一旦jsonからobjにidを生成して付与。
            $obj = json_decode($stroke);
            $obj[0][0] = $this->onMessage_idx($data); // idxはinfo(0要素)の先頭(0番目）。frontのStroke.jsonを参照。
            $stroke = json_encode($obj);

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

    /**
     * idx = paper->created_atからの経過秒
     */
    private function onMessage_idx(\App\U\DrawchatWSMessageToServer $data): string
    {
        $row = \App\Models\Paper::find($data->paper_id);
        $created = \Carbon\Carbon::parse($row->created_at);
        $diff = \Carbon\Carbon::now()->diffInSeconds($created);
        return $diff;
    }
    private function onMessage_undo(\App\Models\User $user, \App\U\DrawchatWSMessageToServer $data): void
    {
        // websocket対応のため、transaction
        \Illuminate\Support\Facades\DB::transaction(function () use ($user, $data) {
            // 自分のレコードを取得
            $q = \App\Models\Draw::query();
            $q->where("user_id", "=", $user->id);
            $q->where("paper_id", "=", $data->paper_id);
            $row = $q->first();
            if (!$row) {
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
    private function onMessage_prompt($str): void
    {
        echo now()->format("Y-m-d H:i:s") . PHP_EOL;
    }

    private function onMessage_sendOnly(string $text, \Ratchet\ConnectionInterface $from): void
    {
        if ($text && strlen($text)) {
            $from->send($text);
        }
    }

    private function onMessage_sendAll(string $text): void
    {
        foreach ($this->clients as $client) {
            // The sender is not the receiver, send to each client connected
            $this->onMessage_sendOnly($text, $client);
        }
    }

    private function onMessage_makeDrawJson(\App\U\DrawchatWSMessageToServer $data): string
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
