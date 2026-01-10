<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class IbamSeeder extends Seeder
{
    public function run(): void
    {
        // Filières
        $filieres = [
            ['code_filiere' => 'INFO', 'nom_filiere' => 'Informatique'],
            ['code_filiere' => 'ELEC', 'nom_filiere' => 'Électronique'],
            ['code_filiere' => 'MECA', 'nom_filiere' => 'Mécanique'],
            ['code_filiere' => 'GEST', 'nom_filiere' => 'Gestion'],
        ];
        
        foreach ($filieres as $filiere) {
            DB::table('filieres')->insert(array_merge($filiere, [
                'created_at' => now(),
                'updated_at' => now()
            ]));
        }

        // Utilisateurs de test
        $users = [
            // Étudiants
            [
                'nom' => 'Ouédraogo',
                'prenom' => 'Aminata',
                'email' => 'etudiant1@ibam.bf',
                'password' => Hash::make('password'),
                'role' => 'ETUDIANT',
                'matricule' => 'ETU2024001',
                'filiere_id' => 1,
                'telephone' => '70123456',
                'ine' => 'INE2024000001',
                'niveau' => 'L2'
            ],
            [
                'nom' => 'Kaboré',
                'prenom' => 'Ibrahim',
                'email' => 'etudiant2@ibam.bf',
                'password' => Hash::make('password'),
                'role' => 'ETUDIANT',
                'matricule' => 'ETU2024002',
                'filiere_id' => 2,
                'telephone' => '70234567',
                'ine' => 'INE2024000002',
                'niveau' => 'L1'
            ],
            [
                'nom' => 'Sawadogo',
                'prenom' => 'Fatou',
                'email' => 'etudiant3@ibam.bf',
                'password' => Hash::make('password'),
                'role' => 'ETUDIANT',
                'matricule' => 'ETU2024003',
                'filiere_id' => 1,
                'telephone' => '70345678',
                'ine' => 'INE2024000003',
                'niveau' => 'L3'
            ],
            // Scolarité
            [
                'nom' => 'Traoré',
                'prenom' => 'Mariam',
                'email' => 'scolarite@ibam.bf',
                'password' => Hash::make('password'),
                'role' => 'SCOLARITE',
                'matricule' => 'SCO2024001',
                'telephone' => '70654321'
            ],
            // Enseignants
            [
                'nom' => 'Compaoré',
                'prenom' => 'Jean',
                'email' => 'enseignant1@ibam.bf',
                'password' => Hash::make('password'),
                'role' => 'ENSEIGNANT',
                'matricule' => 'ENS2024001',
                'filiere_id' => 1,
                'telephone' => '70987654'
            ],
            [
                'nom' => 'Zongo',
                'prenom' => 'Marie',
                'email' => 'enseignant2@ibam.bf',
                'password' => Hash::make('password'),
                'role' => 'ENSEIGNANT',
                'matricule' => 'ENS2024002',
                'filiere_id' => 2,
                'telephone' => '70876543'
            ],
            // DA
            [
                'nom' => 'Ouattara',
                'prenom' => 'Paul',
                'email' => 'da@ibam.bf',
                'password' => Hash::make('password'),
                'role' => 'DA',
                'matricule' => 'DA2024001',
                'telephone' => '70456789'
            ]
        ];

        foreach ($users as $user) {
            DB::table('users')->insert(array_merge($user, [
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]));
        }

        // Matières
        $matieres = [
            // Informatique
            ['code_matiere' => 'PROG1', 'nom_matiere' => 'Programmation 1', 'credit' => 4, 'filiere_id' => 1, 'enseignant_id' => 5],
            ['code_matiere' => 'BDD1', 'nom_matiere' => 'Base de Données 1', 'credit' => 3, 'filiere_id' => 1, 'enseignant_id' => 5],
            ['code_matiere' => 'MATH1', 'nom_matiere' => 'Mathématiques 1', 'credit' => 5, 'filiere_id' => 1, 'enseignant_id' => 5],
            ['code_matiere' => 'ALGO1', 'nom_matiere' => 'Algorithmique 1', 'credit' => 4, 'filiere_id' => 1, 'enseignant_id' => 5],
            // Électronique
            ['code_matiere' => 'ELEC1', 'nom_matiere' => 'Électronique Générale', 'credit' => 4, 'filiere_id' => 2, 'enseignant_id' => 6],
            ['code_matiere' => 'PHYS1', 'nom_matiere' => 'Physique Appliquée', 'credit' => 3, 'filiere_id' => 2, 'enseignant_id' => 6],
            ['code_matiere' => 'CIRC1', 'nom_matiere' => 'Circuits Électriques', 'credit' => 4, 'filiere_id' => 2, 'enseignant_id' => 6],
        ];

        foreach ($matieres as $matiere) {
            DB::table('matieres')->insert(array_merge($matiere, [
                'created_at' => now(),
                'updated_at' => now()
            ]));
        }

        // Réclamations de test
        $reclamations = [
            [
                'numero_demande' => 'REC-2024-0001',
                'etudiant_id' => 1,
                'matiere_id' => 1,
                'enseignant_id' => 5,
                'objet_demande' => 'Contestation note examen final',
                'motif' => 'Je conteste ma note de l\'examen final de Programmation 1. Je pense qu\'il y a une erreur dans la correction de ma copie.',
                'note_actuelle' => 8.5,
                'statut' => 'IMPUTEE_ENSEIGNANT',
                'date_soumission' => now()->subDays(5)
            ],
            [
                'numero_demande' => 'REC-2024-0002',
                'etudiant_id' => 2,
                'matiere_id' => 5,
                'enseignant_id' => 6,
                'objet_demande' => 'Demande de révision note TP',
                'motif' => 'Ma note de TP d\'Électronique Générale me semble incorrecte. J\'ai bien réalisé tous les exercices demandés.',
                'note_actuelle' => 12.0,
                'statut' => 'VALIDEE_ENSEIGNANT',
                'note_corrigee' => 15.5,
                'decision_enseignant' => 'Après vérification, erreur de saisie confirmée. Note corrigée.',
                'date_soumission' => now()->subDays(8),
                'date_traitement' => now()->subDays(3)
            ],
            [
                'numero_demande' => 'REC-2024-0003',
                'etudiant_id' => 3,
                'matiere_id' => 2,
                'enseignant_id' => 5,
                'objet_demande' => 'Réclamation note contrôle continu',
                'motif' => 'Je n\'ai pas été présent au contrôle à cause d\'un problème de santé mais j\'ai un certificat médical.',
                'statut' => 'SOUMISE',
                'date_soumission' => now()->subDays(2)
            ],
            [
                'numero_demande' => 'REC-2024-0004',
                'etudiant_id' => 1,
                'matiere_id' => 3,
                'enseignant_id' => 5,
                'objet_demande' => 'Erreur de calcul moyenne',
                'motif' => 'Il semble y avoir une erreur dans le calcul de ma moyenne de Mathématiques 1. Mes notes partielles ne correspondent pas à la moyenne finale.',
                'note_actuelle' => 11.0,
                'statut' => 'TRANSMISE_SCOLARITE',
                'note_corrigee' => 13.5,
                'decision_enseignant' => 'Erreur de calcul confirmée. Note rectifiée.',
                'date_soumission' => now()->subDays(10),
                'date_traitement' => now()->subDays(6)
            ],
            [
                'numero_demande' => 'REC-2024-0005',
                'etudiant_id' => 2,
                'matiere_id' => 6,
                'enseignant_id' => 6,
                'objet_demande' => 'Absence justifiée examen',
                'motif' => 'J\'étais absent à l\'examen de Physique Appliquée pour raisons médicales. Je dispose d\'un certificat médical.',
                'statut' => 'FINALISEE',
                'note_finale' => 14.0,
                'commentaire_final' => 'Examen de rattrapage organisé. Note validée.',
                'date_soumission' => now()->subDays(15),
                'date_finalisation' => now()->subDays(1)
            ]
        ];

        foreach ($reclamations as $reclamation) {
            DB::table('reclamations')->insert(array_merge($reclamation, [
                'created_at' => now(),
                'updated_at' => now()
            ]));
        }

        // Réclamation en brouillon pour test de modification
        DB::table('reclamations')->insert([
            'numero_demande' => 'REC-2024-0006',
            'etudiant_id' => 1,
            'matiere_id' => 4,
            'enseignant_id' => 5,
            'objet_demande' => 'Erreur note TP',
            'motif' => 'Ma note de TP d\'Algorithmique semble incorrecte.',
            'statut' => 'BROUILLON',
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
