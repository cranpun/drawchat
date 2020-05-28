<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', "RoomController@index");
// function () {
//     return view('welcome');
// });

// nullなら新規作成
Route::get('/room/{room_id?}', "RoomController@show");
// function ($room_id = null) {
//     return view('room', compact(["room_id"]));
// });
