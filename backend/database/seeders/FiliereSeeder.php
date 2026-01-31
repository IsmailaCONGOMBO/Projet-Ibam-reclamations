<?php

namespace Database\Seeders;

use App\Models\Filiere;
use Illuminate\Database\Seeder;

class FiliereSeeder extends Seeder
{
    public function run(): void
    {
        $filieres = [
            [
                'code_filiere' => 'L3-INFO',
                'nom_filiere' => 'Licence 3 Informatique',
                'departement' => 'Informatique'
            ],
            [
                'code_filiere' => 'M1-GL',
                'nom_filiere' => 'Master 1 Génie Logiciel',
                'departement' => 'Informatique'
            ],
            [
                'code_filiere' => 'L3-COMPTA',
                'nom_filiere' => 'Licence 3 Comptabilité',
                'departement' => 'Gestion'
            ],
        ];

        foreach ($filieres as $filiere) {
            Filiere::firstOrCreate(
                ['code_filiere' => $filiere['code_filiere']],
                $filiere
            );
        }
    }
}
