@echo off
echo ========================================
echo Initialisation Git pour Projet IBAM
echo ========================================
echo.

git init
echo [OK] Git initialise

git add .
echo [OK] Fichiers ajoutes

git commit -m "Initial commit: Plateforme IBAM - Reclamations de notes avec tests Selenium"
echo [OK] Premier commit effectue

echo.
echo ========================================
echo PROCHAINES ETAPES:
echo ========================================
echo 1. Allez sur https://github.com/new
echo 2. Creez un repository "Projet-Ibam-reclamations"
echo 3. Executez ces commandes:
echo.
echo    git remote add origin https://github.com/VOTRE_USERNAME/Projet-Ibam-reclamations.git
echo    git branch -M main
echo    git push -u origin main
echo.
pause
