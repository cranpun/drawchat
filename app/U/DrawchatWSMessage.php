<?php
namespace App\U;

class DrawchatWSMessage
{
    public $ws_token;
    public $paper_id;
    public $draw;
    const CMD_UNDO = "[[[[UNDO]]]";

    public function __construct($json)
    {
        try {
            $data = json_decode($json);
            $this->ws_token = $data->ws_token;
            $this->paper_id = $data->paper_id;
            $this->draw = $data->draw;
        } catch (\Exception $e) {
            throw new \Exception("ws message : invalid format" . $e->getMessage());
        }
    }

    public function isUndo(): bool
    {
        return $this->draw == "[[[self]]]";
    }

    public static function getCmds(): array
    {
        // キーはJavascriptで扱いやすいもの
        return [
            "undo" => self::CMD_UNDO
        ];
    }
}