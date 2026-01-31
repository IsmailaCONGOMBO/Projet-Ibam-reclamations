<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Reclamation;
use App\Models\Matiere;
use App\Models\Filiere;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class GlobalReclamationFlowTest extends TestCase
{
    use RefreshDatabase;

    protected $student;
    protected $scolarite;
    protected $da;
    protected $enseignant;
    protected $matiere;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Setup Roles and Users
        $this->seed(\Database\Seeders\RoleSeeder::class);
        
        $this->student = User::factory()->create(['role' => 'ETUDIANT']);
        $this->student->assignRole('ETUDIANT');

        $this->scolarite = User::factory()->create(['role' => 'SCOLARITE']);
        $this->scolarite->assignRole('SCOLARITE');

        $this->da = User::factory()->create(['role' => 'DA']);
        $this->da->assignRole('DA');

        $this->enseignant = User::factory()->create(['role' => 'ENSEIGNANT']);
        $this->enseignant->assignRole('ENSEIGNANT');

        $filiere = Filiere::create(['code_filiere' => 'INF', 'nom_filiere' => 'Info', 'departement' => 'tic']);
        $this->matiere = Matiere::create([
            'code_matiere' => 'WEB101', 
            'nom_matiere' => 'Web Dev', 
            'credit' => 3, 
            'filiere_id' => $filiere->id,
            'enseignant_id' => $this->enseignant->id
        ]);
        
        Storage::fake('public');
    }

    public function test_complete_reclamation_flow_happy_path()
    {
        // 1. Student Creates Reclamation
        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');
        
        $response = $this->actingAs($this->student)->postJson('/api/reclamations', [
            'objet' => 'Test Flow',
            'message' => 'Message test',
            'type' => 'NOTE',
            'matiere_id' => $this->matiere->id,
            'piece_jointe' => $file
        ]);

        $response->assertStatus(201);
        $reclamation = Reclamation::first();
        $this->assertEquals('BROUILLON', $reclamation->status);

        // 2. Student Submits
        $this->actingAs($this->student)->postJson("/api/reclamations/{$reclamation->id}/soumettre")
            ->assertStatus(200);
        $this->assertEquals('SOUMIS', $reclamation->fresh()->status);

        // 3. Scolarite Verifies (Recevable)
        $this->actingAs($this->scolarite)->putJson("/api/reclamations/{$reclamation->id}/verifier", [
            'recevable' => true,
            'commentaire' => 'Ok pour moi'
        ])->assertStatus(200);
        $this->assertEquals('RECEVABLE', $reclamation->fresh()->status);

        // 4. DA Imputes to Teacher
        $this->actingAs($this->da)->putJson("/api/reclamations/{$reclamation->id}/imputer", [
            'enseignant_id' => $this->enseignant->id
        ])->assertStatus(200);
        $this->assertEquals('EN_TRAITEMENT', $reclamation->fresh()->status);

        // 5. Enseignant Treats (Valide -> Note Change)
        $this->actingAs($this->enseignant)->putJson("/api/reclamations/{$reclamation->id}/traiter", [
            'valide' => true,
            'note_corrigee' => 18,
            'commentaire' => 'Erreur de calcul corrigée'
        ])->assertStatus(200);
        $this->assertEquals('VALIDE_ENSEIGNANT', $reclamation->fresh()->status);
        $this->assertEquals(18, $reclamation->fresh()->note_corrigee);

        // 6. DA Transmits to Scolarite
        $this->actingAs($this->da)->putJson("/api/reclamations/{$reclamation->id}/transmettre-scolarite", [
            'commentaire' => 'A traiter'
        ])->assertStatus(200);
        $this->assertEquals('TRANSMIS_SCOLARITE', $reclamation->fresh()->status);

        // 7. Scolarite Finalizes
        $this->actingAs($this->scolarite)->putJson("/api/reclamations/{$reclamation->id}/finaliser", [
            'commentaire' => 'Dossier clos'
        ])->assertStatus(200);
        $this->assertEquals('TRAITE', $reclamation->fresh()->status);
    }

    public function test_rejection_at_verification()
    {
        // Setup existing reclamation
        $reclamation = Reclamation::create([
            'objet' => 'Test Rejet', 'message' => 'Msg', 'type' => 'NOTE',
            'matiere_id' => $this->matiere->id, 'etudiant_id' => $this->student->id,
            'status' => 'SOUMIS'
        ]);

        // Scolarite Rejects
        $this->actingAs($this->scolarite)->putJson("/api/reclamations/{$reclamation->id}/verifier", [
            'recevable' => false,
            'commentaire' => 'Hors délais'
        ])->assertStatus(200);
        
        $this->assertEquals('REJETE', $reclamation->fresh()->status);
    }
}
