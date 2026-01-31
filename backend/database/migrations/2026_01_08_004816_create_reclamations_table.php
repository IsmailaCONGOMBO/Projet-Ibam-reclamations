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
            $table->string('objet');
            $table->text('message');
            $table->string('type');
            $table->enum('status', [
                'BROUILLON', 
                'SOUMIS', 
                'RECEVABLE', 
                'REJETE', 
                'EN_TRAITEMENT', 
                'VALIDE_ENSEIGNANT', 
                'INVALIDE_ENSEIGNANT', 
                'TRANSMIS_SCOLARITE',
                'TRAITE'
            ])->default('BROUILLON');
            $table->foreignId('etudiant_id')->constrained('users');
            $table->foreignId('matiere_id')->constrained('matieres');
            $table->foreignId('enseignant_id')->nullable()->constrained('users');
            $table->text('commentaire_enseignant')->nullable();
            $table->text('commentaire_scolarite')->nullable();
            $table->timestamp('date_soumission')->nullable();
            $table->timestamp('date_traitement')->nullable();
            $table->timestamp('date_validation')->nullable();
            $table->timestamps();
            $table->softDeletes();
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
