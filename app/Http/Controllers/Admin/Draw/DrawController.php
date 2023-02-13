<?php

namespace App\Http\Controllers\Admin\Draw;

use App\Models\Draw;
use Illuminate\Http\Request;

class DrawController extends \App\Http\Controllers\Controller
{
    use \App\Http\Controllers\Admin\Draw\DrawTraitAdd;
    use \App\Http\Controllers\Admin\Draw\DrawTraitLoad;
    use \App\Http\Controllers\Admin\Draw\DrawTraitUndo; // use load
}
