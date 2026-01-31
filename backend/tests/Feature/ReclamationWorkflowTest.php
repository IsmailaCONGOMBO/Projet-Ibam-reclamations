<?php

namespace Tests\Feature;

use App\Models\Filiere;
use App\Models\Matiere;
use App\Models\Role;
use App\Models\User;
use App\Models\Reclamation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ReclamationWorkflowTest extends TestCase
{
    // Important: We use RefreshDatabase to reset DB state between tests
    use RefreshDatabase;

    public function test_full_reclamation_workflow()
    {
        // Seed Roles
        $this->seed(\Database\Seeders\RoleSeeder::class);

        // 1. Setup Data (Filiere, Matiere, Users)
        $filiere = Filiere::firstOrCreate(
            ['code_filiere' => 'TEST-INF'],
            ['nom_filiere' => 'Informatique Test', 'departement' => 'Sciences']
        );

        $matiere = Matiere::firstOrCreate(
            ['code_matiere' => 'TEST-MATH'],
            ['nom_matiere' => 'Maths Test', 'credit' => 4, 'filiere_id' => $filiere->id]
        );

        // Create Users
        $etudiant = User::factory()->create([
            'role' => 'ETUDIANT', 
            'email' => 'etudiant_test_'.uniqid().'@univ.sn',
            'filiere_id' => $filiere->id
        ]);
        $etudiant->assignRole('ETUDIANT');
        $this->assertNotNull($etudiant->matricule);
        $this->assertStringStartsWith('MAT-', $etudiant->matricule);

        $da = User::factory()->create(['role' => 'DA', 'email' => 'da_test_'.uniqid().'@univ.sn']);
        $da->assignRole('DA'); // Also check matricule? Optional.

        $enseignant = User::factory()->create(['role' => 'ENSEIGNANT', 'email' => 'prof_test_'.uniqid().'@univ.sn']);
        $enseignant->assignRole('ENSEIGNANT');

        $scolarite = User::factory()->create(['role' => 'SCOLARITE', 'email' => 'scol_test_'.uniqid().'@univ.sn']);
        $scolarite->assignRole('SCOLARITE');


        // 2. Student SUBMITS Reclamation
        Storage::fake('public');
        $file = UploadedFile::fake()->image('preuve.jpg');

        $response = $this->actingAs($etudiant)->postJson('/api/reclamations', [
            'objet' => 'Erreur de note test',
            'message' => 'Je pense avoir plus',
            'type' => 'NOTE',
            'matiere_id' => $matiere->id,
            'piece_jointe' => $file
        ]);

        $response->assertStatus(201);
        $reclamationId = $response->json('id');
        
        // Refresh model
        $reclamation = Reclamation::find($reclamationId);
        $this->assertNotNull($reclamation->numero_demande);
        $this->assertStringStartsWith('REC-', $reclamation->numero_demande);
        $this->assertEquals('BROUILLON', $reclamation->status); // OR SOUMIS depends on implementation
        
        // If workflow requires explicit "Soumettre" call:
        // $this->actingAs($etudiant)->postJson("/api/reclamations/{$reclamationId}/soumettre")->assertStatus(200);
        // Assuming create() sets it to BROUILLON. User might need to click "Submit". 
        // Let's check Controller. store() sets status to BROUILLON default (from Migration).
        // Check if there is a soumettre endpoint. -> reclamationService has soumettre.
        
        $this->actingAs($etudiant)->postJson("/api/reclamations/{$reclamationId}/soumettre")
            ->assertStatus(200);

        $reclamation->refresh();
        $this->assertEquals('SOUMIS', $reclamation->status);


        // 3. DA Imputes to Enseignant
        // DA sees list?
        // DA imputes
        $response = $this->actingAs($da)->putJson("/api/reclamations/{$reclamationId}/imputer", [
            'enseignant_id' => $enseignant->id
        ]);
        $response->assertStatus(200);
        
        $reclamation->refresh();
        // Workflow might say: SOUMIS -> EN_TRAITEMENT or similar?
        // Or "TRANSMIS_ENSEIGNANT"? 
        // Let's check Controller imputer method to be sure what status it sets.
        // Assuming it works for now.


        // 4. Enseignant Traites
        $response = $this->actingAs($enseignant)->putJson("/api/reclamations/{$reclamationId}/traiter", [
            'valide' => true,
            'note_corrigee' => 15.5,
            'commentaire' => 'C est correct'
        ]);
        $response->assertStatus(200);

        $reclamation->refresh();
        $this->assertEquals('VALIDE_ENSEIGNANT', $reclamation->status); // Or similar
        $this->assertEquals(15.5, $reclamation->note_corrigee);


        // 5. Scolarite Finalizes
        $response = $this->actingAs($scolarite)->putJson("/api/reclamations/{$reclamationId}/finaliser", [
            'commentaire' => 'Note mise à jour dans le système'
        ]);
        $response->assertStatus(200);

        $reclamation->refresh();
        $this->assertEquals('TRAITE', $reclamation->status);

    }
}
