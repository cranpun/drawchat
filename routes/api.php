<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::prefix("draw")->group(function() {
    Route::get("/{paper_id}", "DrawController@index");
    Route::post("/{paper_id}", "DrawController@add");
    Route::get("/{paper_id}/mine/{user_id}", "DrawController@mine"); // 暫定？user_idはログインをセッションで持ってればいらないかも
    Route::get("/{paper_id}/other/{user_id}", "DrawController@other"); // 暫定？user_idはログインをセッションで持ってればいらないかも
});
