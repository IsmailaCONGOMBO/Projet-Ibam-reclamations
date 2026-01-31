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
            $table->decimal('note_actuelle', 5, 2)->nullable()->after('status');
            $table->decimal('note_corrigee', 5, 2)->nullable()->after('note_actuelle');
            $table->text('decision_enseignant')->nullable()->after('note_corrigee');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reclamations', function (Blueprint $table) {
            $table->dropColumn(['note_actuelle', 'note_corrigee', 'decision_enseignant']);
        });
    }
};
