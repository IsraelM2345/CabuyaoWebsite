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
        if (!Schema::hasColumn('public_councilors', 'election_date')) {
            Schema::table('public_councilors', function (Blueprint $table) {
                $table->string('election_date')->nullable()->after('birthday');
                $table->string('assumption_date')->nullable()->after('election_date');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('public_councilors', 'election_date')) {
            Schema::table('public_councilors', function (Blueprint $table) {
                $table->dropColumn(['election_date', 'assumption_date']);
            });
        }
    }
};