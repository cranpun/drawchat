<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('active')->default(\App\L\OnOff::ID_ON);
            $table->string('name');
            $table->string('display_name');
            $table->string('role');
            $table->string('email')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->datetime("last_datetime")->nullable();
            $table->string("last_action")->nullable();
            $table->bigInteger("last_user_id")->nullable();
            $table->rememberToken();
            $table->string("ws_token", 100)->nullable();
            $table->timestamp("ws_token_at")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
