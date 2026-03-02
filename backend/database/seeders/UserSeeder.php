<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password');

        // 1. Etudiant
        $etudiant = User::firstOrCreate(
            ['email' => 'etudiant@ibam.bf'],
            [
                'nom' => 'Diallo',
                'prenom' => 'Amadou',
                'matricule' => 'ET2024001',
                'password' => $password,
                'role' => 'ETUDIANT'
            ]
        );
        $etudiant->assignRole('ETUDIANT');

        // Etudiant 2 - Mama Diawara
        $etudiant2 = User::firstOrCreate(
            ['email' => 'mamadiawara1962@gmail.com'],
            [
                'nom' => 'Diawara',
                'prenom' => 'Mama',
                'matricule' => 'ET2024002',
                'password' => $password,
                'role' => 'ETUDIANT'
            ]
        );
        $etudiant2->assignRole('ETUDIANT');

        // Etudiant 3 - Sommaila Congombo
        $etudiant3 = User::firstOrCreate(
            ['email' => 'sommailacongombo@gmail.com'],
            [
                'nom' => 'Congombo',
                'prenom' => 'Sommaila',
                'matricule' => 'ET2024003',
                'password' => $password,
                'role' => 'ETUDIANT'
            ]
        );
        $etudiant3->assignRole('ETUDIANT');

        // 2. Enseignant
        $enseignant = User::firstOrCreate(
            ['email' => 'enseignant@ibam.bf'],
            [
                'nom' => 'Ouedraogo',
                'prenom' => 'Jean',
                'matricule' => 'PROF001',
                'password' => $password,
                'role' => 'ENSEIGNANT'
            ]
        );
        $enseignant->assignRole('ENSEIGNANT');

        // 3. Scolarité
        $scolarite = User::firstOrCreate(
            ['email' => 'scolarite@ibam.bf'],
            [
                'nom' => 'Service',
                'prenom' => 'Scolarité',
                'matricule' => 'SCOL001',
                'password' => $password,
                'role' => 'SCOLARITE'
            ]
        );
        $scolarite->assignRole('SCOLARITE');

        // 4. Directeur (DA)
        $da = User::firstOrCreate(
            ['email' => 'da@ibam.bf'],
            [
                'nom' => 'Directeur',
                'prenom' => 'Adjoint',
                'matricule' => 'DA001',
                'password' => $password,
                'role' => 'DA'
            ]
        );
        $da->assignRole('DA');
    }
}
