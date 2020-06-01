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

Route::prefix("desc")->group(function() {
    Route::get("/{room_id}", "DescController@index");
    Route::post("/{room_id}", "DescController@add");
    Route::get("/{room_id}/my/{user_id}", "DescController@my"); // 暫定？user_idはログインをセッションで持ってればいらないかも
    Route::get("/{room_id}/other/{user_id}", "DescController@other"); // 暫定？user_idはログインをセッションで持ってればいらないかも
});
