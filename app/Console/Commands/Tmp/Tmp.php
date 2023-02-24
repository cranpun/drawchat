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
    protected $description = '旧json_drawを新しい形式に変換するコマンド';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $paper_ids = $this->loadPaperIds();

        foreach ($paper_ids as $paper_id) {
            $draws = $this->loadDraws($paper_id);
            $json = $this->makeNewJson($draws);
            // echo number_format(mb_strlen($json)) . "<br/>";

            // 古いdrawは削除
            \App\Models\Draw::where("paper_id", "=", $paper_id)->delete();
            // 新しく作成
            $ent = new \App\Models\Draw();
            $ent->paper_id = $paper_id;
            $ent->user_id = 1; // 過去データ＝ユーザ情報が不明なので1固定
            $ent->json_draw = $json;
            $ent->save();
        }
    }

    private function loadPaperIds()
    {
        $q = \App\Models\Draw::query();
        $q->select([
            "paper_id"
        ]);
        $q->distinct();
        $rows = $q->pluck("paper_id");
        return $rows;
    }

    private function loadDraws($paper_id)
    {
        $q = \App\Models\Draw::query();
        $q->where("paper_id", "=", $paper_id);
        $q->orderBy("id", "ASC");
        $rows = $q->get();
        return $rows;
    }

    private function makeNewJson($draws)
    {
        // id順に並んでいるのでこの順に処理すれば自然と古い順になるはず
        $strokes = [];
        foreach ($draws as $draw) {
            $nows = json_decode($draw->json_draw);
            $strokes = array_merge($strokes, $nows);
        }

        $ret = [];
        $idx = 1;
        foreach ($strokes as $stroke) {
            $ret[] = $this->renewStroke($stroke, $idx);
            $idx++;
        }

        // json_encode
        $json = json_encode($ret);

        // 先頭と末尾のかっこを取る。処理高速化のため、末尾に追加するだけにするため。
        $len = mb_strlen($json);
        $str = mb_substr($json, 1, $len - 2); // 先頭と末尾のかっこ分-2
        return $str;
    }

    private function renewStroke($stroke, $idx)
    {
        $idx = 1;

        // 現在が$stroke[0]がinfo、[1]がpoint。
        // pointはそのままでいいのでinfoを調整
        // infoは[0]=color, [1]=thick。
        // これを[0]=idx, [1]=color, [2]=thickに変更
        $stroke[0][2] = $stroke[0][1]; // thickを空きに
        $stroke[0][1] = $stroke[0][0]; // colorをthickに
        $stroke[0][0] = $idx; // idxをcolorに

        return $stroke;
    }
}
