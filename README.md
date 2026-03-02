# 🎓 IBAM - Plateforme de Réclamations de Notes

Système de dématérialisation des demandes de réclamation de notes pour l'Institut Burkinabè des Arts et Métiers.

##  Architecture
- **Frontend** : React 18 + Vite + Tailwind CSS
- **Backend** : Laravel 12 API + Sanctum
- **Base de données** : MySQL 8.0+

##  Installation Rapide

### Prérequis
- PHP 8.2+
- Node.js 18+
- MySQL 8.0+
- Composer

### Backend
```bash
cd backend
composer install
cp .env.example .env
# Configurer DB_* dans .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

##  Comptes de Test
- **Étudiant** : etudiant@ibam.bf / password
- **Scolarité** : scolarite@ibam.bf / password  
- **Enseignant** : enseignant@ibam.bf / password
- **DA** : da@ibam.bf / password

##  Workflow
BROUILLON → SOUMISE → RECEVABLE → IMPUTEE → VALIDEE → TRAITEE