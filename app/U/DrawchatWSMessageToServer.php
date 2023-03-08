<?php
namespace App\U;

class DrawchatWSMessageToServer
{
    public $ws_token;
    public $paper_id;
    public $cmd;
    public $draw;

    const CMD_REGISTER = "register";
    const CMD_DRAW = "draw";
    const CMD_UNDO = "undo";
    const CMD_POS = "pos";

    public function __construct($json)
    {
        try {
            $data = json_decode($json);
            $this->ws_token = $data->ws_token;
            $this->paper_id = $data->paper_id;
            $this->cmd = $data->cmd;
            $this->draw = $data->draw;
        } catch (\Exception $e) {
            throw new \Exception("ws message : invalid format" . $e->getMessage());
        }
    }

    public static function getCmds(): array
    {
        // キーはJavascriptで直かき
        return [
            "register" => self::CMD_REGISTER,
            "draw" => self::CMD_DRAW,
            "undo" => self::CMD_UNDO,
            "pos" => self::CMD_POS,
        ];
    }
}