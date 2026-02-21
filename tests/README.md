# 🧪 Tests Selenium - IBAM Réclamations

Tests automatisés de connexion avec Selenium et Python.

## 📦 Installation

```bash
cd tests
pip install -r requirements.txt
```

## 🚀 Exécution

### Test de connexion des acteurs
```bash
python simple_login_test.py
```

### Test de validation note corrigée (0-20)
```bash
python test_note_corrigee.py
```

### Test de charge (10 utilisateurs en parallèle)
```bash
python test_charge.py
```

### Test de performance (temps de réponse)
```bash
python test_performance.py
```

### Test unitaire (vérification titres)
```bash
python test_titres.py
```

### Debug (si problème)
```bash
python debug_login.py
```

## 📋 Tests

- **simple_login_test.py** : Teste la connexion des 4 acteurs (étudiant, scolarité, enseignant, DA)
- **test_note_corrigee.py** : Test de fumée pour la validation des notes corrigées (0-20) côté enseignant
- **test_charge.py** : Test de charge avec 10 utilisateurs en parallèle + export CSV
- **test_performance.py** : Test de performance mesurant le temps de réponse de 7 actions + export CSV
- **test_titres.py** : Test unitaire vérifiant les titres des formulaires/pages
- **debug_login.py** : Script de debug pour identifier les problèmes

## ⚙️ Prérequis

- Chrome installé
- ChromeDriver dans le PATH
- Backend démarré : `php artisan serve`
- Frontend démarré : `npm run dev`
- Au moins une réclamation existante pour tester la note corrigée
