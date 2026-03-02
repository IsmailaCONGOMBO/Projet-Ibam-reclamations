from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def test_login(email, password, role):
    """Test de connexion pour un acteur"""
    print(f"\n Test de connexion: {role}")
    print(f"   Email: {email}")
    
    # Initialiser le driver
    driver = webdriver.Chrome()
    driver.maximize_window()
    
    try:
        # Aller sur la page de connexion
        driver.get("http://localhost:5173")
        time.sleep(1)
        print("    Page chargée")
        
        # Remplir le formulaire
        email_input = WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
        )
        email_input.clear()
        email_input.send_keys(email)
        
        password_input = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        password_input.clear()
        password_input.send_keys(password)
        print("    Formulaire rempli")
        
        # Soumettre
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
        print("    Formulaire soumis")
        
        # Vérifier la redirection
        time.sleep(3)
        
        # Pour identifiants invalides, vérifier qu'on reste sur login
        if "invalid" in email.lower():
            if "login" in driver.current_url.lower() or driver.current_url == "http://localhost:5173/":
                print(f"  SUCCÈS - Identifiants invalides rejetés")
                return True
            else:
                print(f"    ÉCHEC - Identifiants invalides acceptés")
                return False
        
        # Pour identifiants valides, vérifier redirection dashboard
        WebDriverWait(driver, 15).until(
            EC.url_contains("/dashboard")
        )
        
        if "dashboard" in driver.current_url.lower():
            print(f"    SUCCÈS - Connexion réussie pour {role}")
            print(f"   URL: {driver.current_url}")
            return True
        else:
            print(f"    ÉCHEC - Pas de redirection vers dashboard")
            return False
            
    except Exception as e:
        print(f"    ERREUR: {str(e)}")
        return False
    finally:
        driver.quit()

if __name__ == "__main__":
    print("=" * 60)
    print(" TESTS DE CONNEXION - PLATEFORME IBAM")
    print("=" * 60)
    
    # Liste des acteurs à tester
    acteurs = [
        ("etudiant@ibam.bf", "password", "Étudiant"),
        ("scolarite@ibam.bf", "password", "Scolarité"),
        ("enseignant@ibam.bf", "password", "Enseignant"),
        ("da@ibam.bf", "password", "DA"),
        ("invalid@ibam.bf", "wrongpassword", "Identifiants invalides")
    ]
    
    resultats = []
    for email, password, role in acteurs:
        success = test_login(email, password, role)
        resultats.append((role, success))
        time.sleep(1)
    
    # Résumé
    print("\n" + "=" * 60)
    print(" RÉSUMÉ DES TESTS")
    print("=" * 60)
    for role, success in resultats:
        status = "✓ PASSÉ" if success else " ÉCHOUÉ"
        print(f"{status} - {role}")
    
    total = len(resultats)
    passes = sum(1 for _, s in resultats if s)
    print(f"\nTotal: {passes}/{total} tests réussis")
    print("=" * 60)
