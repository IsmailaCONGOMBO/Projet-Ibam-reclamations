<?php

namespace Database\Seeders;

use App\Models\Matiere;
use App\Models\Filiere;
use App\Models\User;
use Illuminate\Database\Seeder;

class MatiereSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer l'enseignant de démo
        $enseignant = User::where('email', 'enseignant@ibam.bf')->first();

        // Récupérer une filière (L3-INFO)
        $filiereInfo = Filiere::where('code_filiere', 'L3-INFO')->first();
        $filiereCompta = Filiere::where('code_filiere', 'L3-COMPTA')->first();

        if (!$filiereInfo) return;

        $matieres = [
            [
                'code_matiere' => 'PROG-WEB',
                'nom_matiere' => 'Programmation Web',
                'credit' => 4,
                'filiere_id' => $filiereInfo->id,
                'enseignant_id' => $enseignant?->id
            ],
            [
                'code_matiere' => 'ALGO',
                'nom_matiere' => 'Algorithmique Avancée',
                'credit' => 6,
                'filiere_id' => $filiereInfo->id,
                'enseignant_id' => $enseignant?->id
            ],
            [
                'code_matiere' => 'COMPTA-GEN',
                'nom_matiere' => 'Comptabilité Générale',
                'credit' => 5,
                'filiere_id' => $filiereCompta?->id,
                'enseignant_id' => null // Pas encore d'enseignant assigné
            ]
        ];

        foreach ($matieres as $matiere) {
            // Check if filiere_id is present (in case compta filiere missing)
            if (isset($matiere['filiere_id'])) {
                Matiere::firstOrCreate(
                    ['code_matiere' => $matiere['code_matiere']],
                    $matiere
                );
            }
        }
    }
}
