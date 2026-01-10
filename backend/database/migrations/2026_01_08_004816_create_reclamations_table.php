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
        Schema::create('reclamations', function (Blueprint $table) {
            $table->id();
            $table->string('numero_demande')->unique();
            $table->foreignId('etudiant_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('matiere_id')->constrained('matieres')->onDelete('cascade');
            $table->foreignId('enseignant_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('objet_demande');
            $table->text('motif');
            $table->enum('statut', [
                'BROUILLON', 'SOUMISE', 'RECEVABLE', 'REJETEE',
                'IMPUTEE_ENSEIGNANT', 'VALIDEE_ENSEIGNANT', 'INVALIDEE_ENSEIGNANT', 
                'TRANSMISE_SCOLARITE', 'FINALISEE'
            ])->default('BROUILLON');
            $table->decimal('note_actuelle', 4, 2)->nullable();
            $table->decimal('note_corrigee', 4, 2)->nullable();
            $table->text('commentaire_scolarite')->nullable();
            $table->text('decision_enseignant')->nullable();
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamp('date_soumission')->nullable();
            $table->timestamp('date_traitement')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reclamations');
    }
};
