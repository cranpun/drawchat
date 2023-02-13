<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Draw\DrawController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(["can:admin","auth","verified"])->group(function () {
    Route::get("/draw/{paper_id}", [DrawController::class, "load"]);
    Route::post("/draw/{paper_id}", [DrawController::class, "add"]);
    Route::post("/draw/undo/{draw_id}", [DrawController::class, "undo"]);
});
