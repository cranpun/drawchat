<?php

namespace App\U;


class U {
    public static function invokeErrorValidate($request, $message)
    {
        if($message != null) {
            $request->session()->flash("message-error", $message);
        }
        $validate = [
            "dummy" => "required"
        ];
        $request->validate($validate);
    }
    public static function toAssoc($rows, $clmid = "id", $clmname = "name")
    {
        // 連想配列に変換
        $ret = [];
        foreach($rows as $row) {
            $ret[$row[$clmid]] = $row[$clmname];
        }
        return $ret;
    }
    public static function query2array($q)
    {
        $ret = $q->get()->map(function($item) {
            return (array)$item;
        })->all();
        return $ret;
    }
    public static function getd($key, $array, $def) {
        $arr = (array)$array;
        $ret = array_key_exists($key, $arr) ? $arr[$key] : $def;
        return $ret;
    }
    public static function vald($val, $def) {
        $ret = $val ? $val : $def;
        return $ret;
    }
    /**
     * 配列nameを安全な内容に変更
     */
    public static function safeArrayname($name, $replace) {
        $ret = str_replace("[", $replace, str_replace("]", "", $name));
        return $ret;
    }
    public static function filetimelink($url, $filepath) {
        return $url . '?v=' . filemtime($filepath); 
    }
    public static function toSql(\Illuminate\Database\Eloquent\Builder $q)
    {
        return vsprintf(
            str_replace('?', '%s', $q->toSql()),
            collect($q->getBindings())->map(function ($binding) {
                return is_numeric($binding) ? $binding : "'{$binding}'";
            })->toArray()
        );
    }

    public static function div($num1, $num2)
    {
        if($num2 == 0) {
            return 0;
        } else {
            return $num1 / $num2;
        }
    }
    public static function totalclm($data): array
    {
        // 数値データであればトータルを計算。
        $ret = [];
        foreach($data as $row) {
            if(is_array($row)) {
                $arr = $row;
            } else {
                // モデルなら配列化
                $arr = $row->toArray();
            }
            foreach($arr as $clm => $val) {
                if(is_numeric($val)) {
                    if(!array_key_exists($clm, $ret)) {
                        $ret[$clm] = 0;
                    }
                    $ret[$clm] += $val;
                }
            }
        }
        return $ret;
    }
}