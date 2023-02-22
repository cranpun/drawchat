<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDrawTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('draw', function (Blueprint $table) {
            $table->id();
            $table->integer("paper_id");
            $table->integer("user_id");
            $table->text("json_draw");
            $table->timestamps();

            // 制約
            $table->unique(["paper_id", "user_id"]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('draw');
    }
}
