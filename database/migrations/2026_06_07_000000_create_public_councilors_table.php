<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('public_councilors')) {
            Schema::create('public_councilors', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('position')->default('Councilor');
                $table->string('education')->nullable();
                $table->string('birthday')->nullable();
                $table->text('chairmanships')->nullable(); // JSON or comma-separated
                $table->text('memberships')->nullable(); // JSON or comma-separated
                $table->string('photo_path')->nullable();
                $table->integer('order_column')->default(0);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('public_councilors');
    }
};