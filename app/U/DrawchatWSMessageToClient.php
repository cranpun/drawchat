<?php
namespace App\U;

class DrawchatWSMessageToClient
{
    public $cmd;
    public $draw;

    const CMD_DRAW = "draw";
    const CMD_POS = "pos";
    const CMD_RELOAD = "reload";

    public function __construct($cmd, $draw)
    {
        try {
            $this->cmd = $cmd;
            $this->draw = $draw;
        } catch (\Exception $e) {
            throw new \Exception("ws message : invalid format" . $e->getMessage());
        }
    }

    public static function getCmds(): array
    {
        // キーはJavascriptで直かき
        return [
            "draw" => self::CMD_DRAW,
            "pos" => self::CMD_POS,
            "reload" => self::CMD_RELOAD,
        ];
    }

    public function json(): string
    {
        $data = [
            "cmd" => $this->cmd,
            "draw" => $this->draw
        ];
        $ret = json_encode($data);
        return $ret;
    }
}