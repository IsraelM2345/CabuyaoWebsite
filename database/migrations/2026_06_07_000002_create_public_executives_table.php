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
        if (!Schema::hasTable('public_executives')) {
            Schema::create('public_executives', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('position'); // Mayor or Vice Mayor
                $table->string('email')->nullable();
                $table->string('phone')->nullable();
                $table->string('office')->nullable();
                $table->date('term_start')->nullable();
                $table->date('term_end')->nullable();
                $table->string('election_date')->nullable();
                $table->string('assumption_date')->nullable();
            $table->text('bio')->nullable();
            $table->text('education')->nullable(); // Education background
            $table->text('expertise')->nullable(); // Expertise/Commitments list
            $table->string('quote')->nullable(); // Personal quote/motto
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
        Schema::dropIfExists('public_executives');
    }
};