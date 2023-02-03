<?php

namespace App\L;

/**
 * ラベルクラスの基底クラス。名前はソート時に一番下にくるように。
 */
abstract class ZzzLabel
{
    const ID_ALL = "all";

    /**
     * id, nameの連想配列の配列を返す
     */
    abstract public function labels() : array;

    /**
     * コンストラクタで指定されたallの設定に従ってlabel連想配列の配列を返す
     */
    public function labelsAll() : array
    {
        $ret = array_merge([
            self::ID_ALL => "（全て）"
        ], $this->labels());
        return $ret;
    }

    public function labelObjs() : array
    {
        $labels = $this->labels();
        $ret = [];
        foreach($labels as $key => $label) {
            $ret[] = [
                "id" => $key,
                "name" => $label
            ];
        }

        return $ret;
    }
    public function labelObjsAll() : array
    {
        $labels = $this->labelsAll();
        $ret = [];
        foreach($labels as $key => $label) {
            $ret[] = [
                "id" => $key,
                "name" => $label
            ];
        }

        return $ret;
    }

    /**
     * sqlのcase節を生成。
     * @param string $clm caseに適応するテーブルのカラム
     * @param string $alias string ASの名前
     */
    public function sqlCase(string $clm, string $alias) : string
    {
        $case = "";
        foreach ($this->labels() as $key => $label) {
            $case .= " WHEN {$clm}='{$key}' THEN '{$label}' ";
        }
        $ret = "CASE {$case} END AS {$alias}";
        return $ret;
    }

    /**
     * 対応するラベルを取得
     */
    public function label(string $id) : string
    {
        $labels = $this->labels();
        $ret = array_key_exists($id, $labels) ? $labels[$id] : "（未設定）";
        return $ret;
    }
}
