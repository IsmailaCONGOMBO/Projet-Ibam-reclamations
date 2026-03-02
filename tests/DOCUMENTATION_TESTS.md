# 📊 Documentation des Tests Selenium - Plateforme IBAM

## 🎯 Vue d'ensemble

Cette suite de tests automatisés utilise **Selenium WebDriver avec Python** pour valider le bon fonctionnement de la plateforme de réclamations de notes de l'IBAM.

---

## 📋 Tests Implémentés

### 1️⃣ Test de Connexion des Acteurs (`simple_login_test.py`)

**Objectif** : Vérifier que les 4 types d'acteurs peuvent se connecter avec succès.

**Acteurs testés** :
- Étudiant (`etudiant@ibam.bf`)
- Scolarité (`scolarite@ibam.bf`)
- Enseignant (`enseignant@ibam.bf`)
- Directeur des Affaires Académiques (`da@ibam.bf`)
- Identifiants invalides (test négatif)

**Processus** :
1. Ouvre la page de connexion
2. Remplit le formulaire (email + mot de passe)
3. Soumet le formulaire
4. Vérifie la redirection vers `/dashboard`

**Résultats fournis** :
```
✅ PASSÉ - Étudiant
✅ PASSÉ - Scolarité
✅ PASSÉ - Enseignant
✅ PASSÉ - DA
❌ ÉCHOUÉ - Identifiants invalides

Total: 4/5 tests réussis
```

**Métriques** :
- Taux de réussite : 80%
- Temps d'exécution : ~20-30 secondes

---

### 2️⃣ Test de Fumée - Validation Note Corrigée (`test_note_corrigee.py`)

**Objectif** : Vérifier que le champ "Nouvelle note" accepte uniquement les valeurs entre 0 et 20.

**Scénario** :
1. Connexion en tant qu'enseignant
2. Navigation vers "Réclamations à traiter"
3. Clic sur "Traiter" pour une réclamation
4. Remplissage du commentaire
5. Sélection "Valider la réclamation (Correction note)"
6. Test du champ "Nouvelle note"

**Valeurs testées** :
- ✅ Valides : 0, 10, 20, 15.5, 12.75
- ❌ Invalides : -1, 21, 25, -5

**Résultats fournis** :
```
✅ Note      0 - Note minimale valide
✅ Note     10 - Note moyenne valide
✅ Note     20 - Note maximale valide
✅ Note   15.5 - Note décimale valide
✅ Note  12.75 - Note décimale valide
✅ Note     -1 - Note négative invalide (rejetée)
✅ Note     21 - Note > 20 invalide (rejetée)
✅ Note     25 - Note très supérieure invalide (rejetée)
✅ Note     -5 - Note négative invalide (rejetée)

Total: 9/9 tests réussis
```

**Métriques** :
- Validation HTML5 : Vérifiée
- Taux de réussite : 100%

---

### 3️⃣ Test de Charge (`test_charge.py`)

**Objectif** : Tester la capacité du système à gérer 10 connexions simultanées.

**Configuration** :
- 10 utilisateurs en parallèle
- 5 workers simultanés (2 vagues)
- Timeout : 30 secondes

**Processus** :
1. Exécution parallèle avec `ThreadPoolExecutor`
2. Chaque utilisateur se connecte indépendamment
3. Mesure du temps de réponse individuel

**Résultats fournis** :
```
📊 STATISTIQUES
✅ Connexions réussies: 10/10
❌ Connexions échouées: 0/10
⏱️  Temps total: 35.56s
📈 Temps de réponse moyen: 6.99s
⚡ Temps de réponse min: 4.21s
🐌 Temps de réponse max: 9.79s
🎯 Taux de réussite: 100%
```

**Export CSV** : `test_charge_resultats.csv`
```csv
user_id,email,status,temps_reponse,timestamp,erreur
1,etudiant@ibam.bf,SUCCÈS,9.63,2026-02-21 08:26:12,
2,scolarite@ibam.bf,SUCCÈS,6.35,2026-02-21 08:26:12,
...
```

**Métriques** :
- Charge supportée : 10 utilisateurs simultanés
- Performance moyenne : 6.99s par connexion

---

### 4️⃣ Test de Performance (`test_performance.py`)

**Objectif** : Mesurer le temps de réponse de 7 actions critiques.

**Actions mesurées** :
1. Chargement page d'accueil
2. Connexion étudiant
3. Chargement dashboard
4. Navigation vers réclamations
5. Déconnexion
6. Connexion enseignant
7. Accès réclamations à traiter

**Résultats fournis** :
```
✅ Chargement page d'accueil: 0.38s
✅ Connexion étudiant: 1.91s
✅ Chargement dashboard: 2.02s
✅ Connexion enseignant: 2.15s
✅ Accès réclamations à traiter: 2.33s
✅ Déconnexion: 3.08s
✅ Navigation vers réclamations: 13.51s

📊 STATISTIQUES
✅ Actions réussies: 7/7
📈 Temps de réponse moyen: 3.63s
🎯 Taux de réussite: 100%

🐌 Top 3 actions les plus lentes:
   1. Navigation vers réclamations: 13.51s
   2. Déconnexion: 3.08s
   3. Accès réclamations à traiter: 2.33s

⚡ Top 3 actions les plus rapides:
   1. Chargement page d'accueil: 0.38s
   2. Connexion étudiant: 1.91s
   3. Chargement dashboard: 2.02s
```

**Export CSV** : `test_performance_resultats.csv`

**Métriques** :
- Performance globale : Bonne (moyenne 3.63s)
- Point d'amélioration : Navigation vers réclamations (13.51s)

---

### 5️⃣ Test Unitaire - Titres de Formulaires (`test_titres.py`)

**Objectif** : Vérifier que chaque page affiche le bon titre.

**Pages testées** :
1. Page de connexion → "Bienvenue"
2. Dashboard étudiant → "IBAM"
3. Liste des réclamations → "IBAM"
4. Dashboard enseignant → "IBAM"
5. Réclamations à traiter → "IBAM"

**Processus** :
1. Navigation vers chaque page
2. Extraction du titre (h1, h2 ou title)
3. Vérification de la correspondance

**Résultats fournis** :
```
✅ Page de connexion
   Titre attendu: 'Bienvenue'
   Titre trouvé: 'Bienvenue'

✅ Dashboard étudiant
   Titre attendu: 'IBAM'
   Titre trouvé: 'IBAM'

✅ Liste des réclamations
   Titre attendu: 'IBAM'
   Titre trouvé: 'IBAM'

✅ Dashboard enseignant
   Titre attendu: 'IBAM'
   Titre trouvé: 'IBAM'

✅ Réclamations à traiter
   Titre attendu: 'IBAM'
   Titre trouvé: 'IBAM'

Total: 5/5 tests réussis
Taux de réussite: 100%
```

**Métriques** :
- Cohérence UI : 100%
- Tous les titres correspondent

---

## 📈 Résumé Global des Tests

| Test | Objectif | Tests | Réussis | Taux | Temps |
|------|----------|-------|---------|------|-------|
| Connexion | Authentification | 5 | 4 | 80% | ~25s |
| Note corrigée | Validation 0-20 | 9 | 9 | 100% | ~30s |
| Charge | 10 utilisateurs | 10 | 10 | 100% | ~36s |
| Performance | Temps réponse | 7 | 7 | 100% | ~45s |
| Titres | Vérification UI | 5 | 5 | 100% | ~20s |
| **TOTAL** | | **36** | **35** | **97.2%** | **~156s** |

---

## 🛠️ Technologies Utilisées

- **Selenium WebDriver 4.16.0** : Automatisation navigateur
- **Python 3.14** : Langage de programmation
- **Chrome/ChromeDriver** : Navigateur de test
- **ThreadPoolExecutor** : Exécution parallèle (test de charge)
- **CSV** : Export des résultats

---

## 🚀 Exécution des Tests

```bash
# Test de connexion
python simple_login_test.py

# Test de validation note
python test_note_corrigee.py

# Test de charge
python test_charge.py

# Test de performance
python test_performance.py

# Test unitaire titres
python test_titres.py
```

---

## 📊 Fichiers de Résultats Générés

1. **test_charge_resultats.csv** : Résultats détaillés du test de charge
2. **test_performance_resultats.csv** : Temps de réponse de chaque action
3. **Screenshots** : Captures d'écran en cas d'erreur

---

## ✅ Conclusion

La suite de tests couvre :
- ✅ Authentification (4 rôles)
- ✅ Validation des données (notes 0-20)
- ✅ Performance sous charge (10 utilisateurs)
- ✅ Temps de réponse des actions
- ✅ Cohérence de l'interface

**Taux de réussite global : 97.2%**

Le système est **stable et performant** avec une moyenne de **3.63s** par action et une capacité à gérer **10 connexions simultanées**.
