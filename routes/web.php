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

Route::get('/', "PaperController@index");
// function () {
//     return view('welcome');
// });

// nullなら新規作成
Route::get('/paper/{paper_id?}', "PaperController@show")->name("open-paper");
// function ($paper_id = null) {
//     return view('paper', compact(["paper_id"]));
// });
