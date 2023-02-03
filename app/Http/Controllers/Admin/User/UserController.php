<?php

namespace App\Http\Controllers\Admin\User;

class UserController extends \App\Http\Controllers\Controller
{

    // *********************************************************
    // utils
    // *********************************************************

    // *********************************************************
    // action
    // *********************************************************
    use \App\Http\Controllers\Admin\User\UserTraitChangepassword;
    use \App\Http\Controllers\Admin\User\UserTraitCreatestore;
    use \App\Http\Controllers\Admin\User\UserTraitDelete;
    use \App\Http\Controllers\Admin\User\UserTraitIndex;
    use \App\Http\Controllers\Admin\User\UserTraitOverwritepassword;
    use \App\Http\Controllers\Admin\User\UserTraitUpdate;
    use \App\Http\Controllers\Admin\User\UserTraitUpdatestore;
}
