<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer l'admin principal (DA)
        $admin = User::firstOrCreate(
            ['email' => 'admin@ibam.com'],
            [
                'nom' => 'Directeur',
                'prenom' => 'Adjoint',
                'password' => Hash::make('password'),
            ]
        );
        
        // Assigner le rôle DA
        $daRole = Role::where('name', 'DA')->first();
        if ($daRole) {
            $admin->assignRole($daRole);
        }

        // Créer un compte scolarité
        $scolarite = User::firstOrCreate(
            ['email' => 'scolarite@ibam.com'],
            [
                'nom' => 'Service',
                'prenom' => 'Scolarité',
                'password' => Hash::make('password'),
            ]
        );
        $scolariteRole = Role::where('name', 'SCOLARITE')->first();
        if ($scolariteRole) {
            $scolarite->assignRole($scolariteRole);
        }
    }
}
