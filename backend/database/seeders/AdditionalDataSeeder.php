<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdditionalDataSeeder extends Seeder
{
    public function run(): void
    {
        // Utilisateurs supplémentaires
        $additionalUsers = [
            // Étudiants supplémentaires
            [
                'nom' => 'Diallo',
                'prenom' => 'Moussa',
                'email' => 'etudiant4@ibam.bf',
                'password' => Hash::make('password'),
                'role' => 'ETUDIANT',
                'matricule' => 'ETU2024004',
                'filiere_id' => 3,
                'telephone' => '70456789',
                'ine' => 'INE2024000004',
                'niveau' => 'L2'
            ],
            [
                'nom' => 'Sana',
                'prenom' => 'Aïcha',
                'email' => 'etudiant5@ibam.bf',
                'password' => Hash::make('password'),
                'role' => 'ETUDIANT',
                'matricule' => 'ETU2024005',
                'filiere_id' => 4,
                'telephone' => '70567890',
                'ine' => 'INE2024000005',
                'niveau' => 'L1'
            ],
            // Enseignant supplémentaire
            [
                'nom' => 'Kaboré',
                'prenom' => 'Alassane',
                'email' => 'enseignant3@ibam.bf',
                'password' => Hash::make('password'),
                'role' => 'ENSEIGNANT',
                'matricule' => 'ENS2024003',
                'filiere_id' => 3,
                'telephone' => '70678901'
            ],
            [
                'nom' => 'Tapsoba',
                'prenom' => 'Salimata',
                'email' => 'enseignant4@ibam.bf',
                'password' => Hash::make('password'),
                'role' => 'ENSEIGNANT',
                'matricule' => 'ENS2024004',
                'filiere_id' => 4,
                'telephone' => '70789012'
            ]
        ];

        foreach ($additionalUsers as $user) {
            DB::table('users')->insert(array_merge($user, [
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]));
        }

        // Matières supplémentaires
        $additionalMatieres = [
            // Mécanique
            ['code_matiere' => 'MECA1', 'nom_matiere' => 'Mécanique Générale', 'credit' => 4, 'filiere_id' => 3, 'enseignant_id' => 8],
            ['code_matiere' => 'THER1', 'nom_matiere' => 'Thermodynamique', 'credit' => 3, 'filiere_id' => 3, 'enseignant_id' => 8],
            ['code_matiere' => 'RESI1', 'nom_matiere' => 'Résistance des Matériaux', 'credit' => 4, 'filiere_id' => 3, 'enseignant_id' => 8],
            // Gestion
            ['code_matiere' => 'COMP1', 'nom_matiere' => 'Comptabilité Générale', 'credit' => 4, 'filiere_id' => 4, 'enseignant_id' => 9],
            ['code_matiere' => 'MARK1', 'nom_matiere' => 'Marketing', 'credit' => 3, 'filiere_id' => 4, 'enseignant_id' => 9],
            ['code_matiere' => 'STAT1', 'nom_matiere' => 'Statistiques', 'credit' => 3, 'filiere_id' => 4, 'enseignant_id' => 9],
        ];

        foreach ($additionalMatieres as $matiere) {
            DB::table('matieres')->insert(array_merge($matiere, [
                'created_at' => now(),
                'updated_at' => now()
            ]));
        }

        // Réclamations supplémentaires
        $additionalReclamations = [
            [
                'numero_demande' => 'REC-2024-0007',
                'etudiant_id' => 4,
                'matiere_id' => 8,
                'enseignant_id' => 8,
                'objet_demande' => 'Note manquante examen partiel',
                'motif' => 'Ma note d\'examen partiel de Mécanique Générale n\'apparaît pas dans le relevé. J\'étais pourtant présent à l\'examen.',
                'statut' => 'RECEVABLE',
                'commentaire_scolarite' => 'Réclamation recevable. Transmission à l\'enseignant.',
                'date_soumission' => now()->subDays(4)
            ],
            [
                'numero_demande' => 'REC-2024-0008',
                'etudiant_id' => 5,
                'matiere_id' => 11,
                'enseignant_id' => 9,
                'objet_demande' => 'Erreur saisie note TP',
                'motif' => 'Il y a une erreur dans la saisie de ma note de TP de Comptabilité. J\'ai obtenu 16/20 mais il est marqué 6/20.',
                'note_actuelle' => 6.0,
                'statut' => 'INVALIDEE_ENSEIGNANT',
                'decision_enseignant' => 'Après vérification de la copie, la note de 6/20 est correcte. Pas d\'erreur de saisie.',
                'date_soumission' => now()->subDays(7),
                'date_traitement' => now()->subDays(2)
            ],
            [
                'numero_demande' => 'REC-2024-0009',
                'etudiant_id' => 1,
                'matiere_id' => 4,
                'enseignant_id' => 5,
                'objet_demande' => 'Demande rattrapage',
                'motif' => 'J\'étais absent à l\'examen d\'Algorithmique à cause d\'un décès dans ma famille. Je dispose d\'un acte de décès.',
                'statut' => 'BROUILLON',
                'date_soumission' => null
            ],
            [
                'numero_demande' => 'REC-2024-0010',
                'etudiant_id' => 3,
                'matiere_id' => 1,
                'enseignant_id' => 5,
                'objet_demande' => 'Contestation barème',
                'motif' => 'Je conteste le barème appliqué pour l\'exercice 3 de l\'examen de Programmation 1. Le barème semble trop sévère.',
                'note_actuelle' => 9.5,
                'statut' => 'REJETEE',
                'commentaire_scolarite' => 'Réclamation non recevable. Le barème a été appliqué de manière uniforme.',
                'date_soumission' => now()->subDays(12)
            ],
            [
                'numero_demande' => 'REC-2024-0011',
                'etudiant_id' => 2,
                'matiere_id' => 7,
                'enseignant_id' => 6,
                'objet_demande' => 'Note projet final',
                'motif' => 'Ma note de projet final de Circuits Électriques me semble faible par rapport au travail fourni. Je souhaite une réévaluation.',
                'note_actuelle' => 11.5,
                'statut' => 'VALIDEE_ENSEIGNANT',
                'note_corrigee' => 14.0,
                'decision_enseignant' => 'Après réévaluation du projet, la note est effectivement sous-évaluée. Correction appliquée.',
                'date_soumission' => now()->subDays(9),
                'date_traitement' => now()->subDays(4)
            ]
        ];

        foreach ($additionalReclamations as $reclamation) {
            DB::table('reclamations')->insert(array_merge($reclamation, [
                'created_at' => now(),
                'updated_at' => now()
            ]));
        }

        // Justificatifs de test
        $justificatifs = [
            [
                'reclamation_id' => 3, // REC-2024-0003 (réclamation note contrôle continu)
                'nom_fichier' => 'certificat_medical.pdf',
                'chemin_fichier' => 'justificatifs/certificat_medical.pdf',
                'type_fichier' => 'pdf',
                'taille' => 245760
            ],
            [
                'reclamation_id' => 5, // REC-2024-0005 (absence justifiée examen)
                'nom_fichier' => 'certificat_medical_2.pdf',
                'chemin_fichier' => 'justificatifs/certificat_medical_2.pdf',
                'type_fichier' => 'pdf',
                'taille' => 189440
            ],
            [
                'reclamation_id' => 9, // REC-2024-0009 (demande rattrapage)
                'nom_fichier' => 'acte_deces.pdf',
                'chemin_fichier' => 'justificatifs/acte_deces.pdf',
                'type_fichier' => 'pdf',
                'taille' => 156672
            ]
        ];

        foreach ($justificatifs as $justificatif) {
            DB::table('justificatifs')->insert(array_merge($justificatif, [
                'created_at' => now(),
                'updated_at' => now()
            ]));
        }
    }
}