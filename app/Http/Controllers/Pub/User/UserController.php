<?php

namespace App\Http\Controllers\Pub\User;

class UserController extends \App\Http\Controllers\Controller
{

    // *********************************************************
    // utils
    // *********************************************************

    // *********************************************************
    // action
    // *********************************************************
    use \App\Http\Controllers\Pub\User\UserTraitAuthenticate;
    use \App\Http\Controllers\Pub\User\UserTraitLogin;
    use \App\Http\Controllers\Pub\User\UserTraitRegister;
    use \App\Http\Controllers\Pub\User\UserTraitRegisterstore;
}
