<?php
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\Admin\User\UserController;
use \App\Http\Controllers\Admin\Paper\PaperController;

Route::middleware(["can:admin","auth","verified"])->group(function () {
    // **************************************************************
    // paper & draw
    // **************************************************************
    Route::get('/', [PaperController::class, "index"])->name("top");
    Route::get('/paper/{paper_id?}', [PaperController::class, "draw"])->name("open-paper");

    // **************************************************************
    // user
    // **************************************************************
    Route::post("/user/createstore", [UserController::class, "createstore"])->name("admin-user-createstore");
    Route::post("/user/delete/{user_id}", [UserController::class, "delete"])->name("admin-user-delete");
    Route::post("/user/changepassword/{user_id}", [UserController::class, "changepassword"])->name("admin-user-changepassword");
    Route::post("/user/overwritepassword/{user_id}", [UserController::class, "overwritepassword"])->name("admin-user-overwritepassword");
    Route::get("/user/index", [UserController::class, "index"])->name("admin-user-index");
    Route::get("/user/update/{user_id}", [UserController::class, "update"])->name("admin-user-update");
    Route::post("/user/updatestore", [UserController::class, "updatestore"])->name("admin-user-updatestore");

});
