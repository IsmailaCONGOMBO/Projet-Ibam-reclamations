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
        Schema::table('reclamations', function (Blueprint $table) {
            if (!Schema::hasColumn('reclamations', 'note_souhaitee')) {
                $table->decimal('note_souhaitee', 5, 2)->nullable()->after('note_actuelle');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reclamations', function (Blueprint $table) {
            if (Schema::hasColumn('reclamations', 'note_souhaitee')) {
                $table->dropColumn('note_souhaitee');
            }
        });
    }
};
