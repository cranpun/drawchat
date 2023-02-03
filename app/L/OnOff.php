<?php

namespace App\L;

class OnOff extends ZzzLabel
{
    const ID_OFF = "off";
    const ID_ON = "on";

    public function labels() : array
    {
        return [
            self::ID_OFF => "－",
            self::ID_ON => "◯",
        ];
    }
}
