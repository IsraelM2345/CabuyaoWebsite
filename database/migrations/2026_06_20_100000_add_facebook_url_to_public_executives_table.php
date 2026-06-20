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
        if (!Schema::hasColumn('public_executives', 'facebook_url')) {
            Schema::table('public_executives', function (Blueprint $table) {
                $table->string('facebook_url')->nullable()->after('photo_path');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('public_executives', 'facebook_url')) {
            Schema::table('public_executives', function (Blueprint $table) {
                $table->dropColumn('facebook_url');
            });
        }
    }
};