<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('reclamations', function (Blueprint $table) {
            $table->decimal('note_finale', 4, 2)->nullable()->after('note_corrigee');
            $table->text('commentaire_final')->nullable()->after('decision_enseignant');
            $table->timestamp('date_finalisation')->nullable()->after('date_traitement');
        });
    }

    public function down()
    {
        Schema::table('reclamations', function (Blueprint $table) {
            $table->dropColumn(['note_finale', 'commentaire_final', 'date_finalisation']);
        });
    }
};