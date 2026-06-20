<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('public_media', function (Blueprint $table) {
            // SQLite is permissive, but the safest approach is to conditionally add
            // columns only if they do not already exist.
            // Laravel's Schema builder does not provide a cross-driver "has column" helper,
            // so we use raw checks in a driver-agnostic way.
            $driver = Schema::getConnection()->getDriverName();

            if ($driver === 'sqlite') {
                $columns = Schema::getConnection()
                    ->select("pragma table_info(public_media)");
                $existing = array_map(fn ($c) => $c->name, $columns);

                if (!in_array('label', $existing, true)) {
                    $table->string('label')->nullable()->after('original_name');
                }
                if (!in_array('description', $existing, true)) {
                    $table->text('description')->nullable()->after('label');
                }
                if (!in_array('category', $existing, true)) {
                    $table->string('category')->nullable()->after('description');
                }
            } else {
                // For other DBs, just try to add (Laravel/DB may already know these columns).
                // If your DB errors on duplicate columns, keep only the SQLite block above.
                $table->string('label')->nullable()->after('original_name');
                $table->text('description')->nullable()->after('label');
                $table->string('category')->nullable()->after('description');
            }
        });
    }

    public function down(): void
    {
        Schema::table('public_media', function (Blueprint $table) {
            $table->dropColumn(['label', 'description', 'category']);
        });
    }
};

