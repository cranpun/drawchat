<?php

namespace App\U;


class U
{
    public static function invokeErrorValidate(\Illuminate\Http\Request $request, string $message): void
    {
        if ($message != null) {
            $request->session()->flash("message-error", $message);
            \Log::channel("myerror")->debug("invokeErrorValidate : {$message}");
        }
        $validate = [
            "dummy" => "required"
        ];
        $request->validate($validate);
    }
    public static function toAssoc(array $rows, string $clmid = "id", string $clmname = "name"): array
    {
        // 連想配列に変換
        $ret = [];
        foreach ($rows as $row) {
            $ret[$row[$clmid]] = $row[$clmname];
        }
        return $ret;
    }
    public static function query2array(\Illuminate\Database\Eloquent\Builder $q): array
    {
        $ret = $q->get()->map(function ($item) {
            return (array)$item;
        })->all();
        return $ret;
    }
    public static function getd(mixed $key, array $array, mixed $def): string
    {
        $arr = (array)$array;
        $ret = array_key_exists($key, $arr) ? $arr[$key] : $def;
        return $ret;
    }
    public static function vald(mixed $val, mixed $def): mixed
    {
        $ret = $val ? $val : $def;
        return $ret;
    }
    /**
     * 配列nameを安全な内容に変更
     */
    public static function safeArrayname(string $name, string $replace): string
    {
        $ret = str_replace("[", $replace, str_replace("]", "", $name));
        return $ret;
    }
    public static function publicfiletimelink(string $filepath): string
    {
        return asset($filepath) . '?v=' . filemtime(join(DIRECTORY_SEPARATOR, [public_path(), $filepath]));
    }
    public static function toSql(\Illuminate\Database\Eloquent\Builder $q): string
    {
        return vsprintf(
            str_replace('?', '%s', $q->toSql()),
            collect($q->getBindings())->map(function ($binding) {
                return is_numeric($binding) ? $binding : "'{$binding}'";
            })->toArray()
        );
    }
    public static function isURL(string $url): bool
    {
        $ret = filter_var($url, FILTER_VALIDATE_URL);
        return $ret !== false; // 失敗した場合はfalseなのでそれ以外であればURL
    }
    // public static function makeCsvWriterObj()
    // {
    //     $csv = \League\Csv\Writer::createFromStream(fopen("php://temp", "r+"));
    //     \League\Csv\CharsetConverter::addTo($csv, "UTF-8", "SJIS");
    //     $csv->setEnclosure('"');
    //     return $csv;
    // }

    // public static function makeCsvReaderObj($filepath)
    // {
    //     $csv = \League\Csv\Reader::createFromPath($filepath);
    //     $csv->addStreamFilter('convert.iconv.cp932/UTF-8');
    //     return $csv;
    // }
    //     public static function sendMail($subject, $text, $tos, $ccs, $bccs)
    //     {
    //         $mail = \Illuminate\Support\Facades\Mail::raw($text, function($message) use ($subject, $tos, $ccs, $bccs) {
    //             $message->to($tos);
    //             if($ccs) {
    //                 $message->cc($ccs);
    //             }
    //             if($bccs) {
    //                 $message->bcc($bccs);
    //             }
    //             $message->from(config('myconf.email_contact'));
    //             $message->subject($subject);
    //         });

    //         // ログ保存
    //         $strtos = join(",", $tos);
    //         $strccs = $ccs ? join(",", $ccs) : "null";
    //         $strbccs = $bccs ? join(",", $bccs) : "null";
    //         $log = <<< EOM

    // subject: {$subject}
    // to : {$strtos}
    // cc : {$strccs}
    // bcc: {$strbccs}
    // body:
    // {$text}

    // EOM;
    //         \Log::channel("mail")->info($log);
    //     }
}
