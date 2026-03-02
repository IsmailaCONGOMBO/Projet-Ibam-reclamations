from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

print("🔍 DEBUG - Test de connexion IBAM\n")

driver = webdriver.Chrome()
driver.maximize_window()

try:
    # 1. Charger la page
    print("1️ Chargement de http://localhost:5173")
    driver.get("http://localhost:5173")
    time.sleep(2)
    print(f"   URL actuelle: {driver.current_url}")
    print(f"   Titre: {driver.title}")
    
    # 2. Chercher les champs du formulaire
    print("\n 2️ Recherche des éléments du formulaire...")
    
    # Essayer de trouver le champ email
    try:
        email_input = driver.find_element(By.NAME, "email")
        print("   Champ email trouvé (name='email')")
    except:
        print("    Champ email NON trouvé avec name='email'")
        # Essayer d'autres sélecteurs
        try:
            email_input = driver.find_element(By.CSS_SELECTOR, "input[type='email']")
            print("    Champ email trouvé (type='email')")
        except:
            print("    Champ email NON trouvé avec type='email'")
            # Afficher tous les inputs
            inputs = driver.find_elements(By.TAG_NAME, "input")
            print(f"\n    Inputs trouvés sur la page ({len(inputs)}):")
            for inp in inputs[:5]:  # Afficher les 5 premiers
                print(f"      - type={inp.get_attribute('type')}, name={inp.get_attribute('name')}, id={inp.get_attribute('id')}")
            driver.quit()
            exit()
    
    # Essayer de trouver le champ password
    try:
        password_input = driver.find_element(By.NAME, "password")
        print("    Champ password trouvé (name='password')")
    except:
        print("    Champ password NON trouvé avec name='password'")
        try:
            password_input = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
            print("    Champ password trouvé (type='password')")
        except:
            print("    Champ password NON trouvé")
            driver.quit()
            exit()
    
    # 3. Remplir le formulaire
    print("\n 3️ Remplissage du formulaire...")
    email_input.clear()
    email_input.send_keys("etudiant@ibam.bf")
    print("    Email saisi: etudiant@ibam.bf")
    
    password_input.clear()
    password_input.send_keys("password")
    print("    Password saisi")
    
    # 4. Chercher le bouton submit
    print("\n 4️ Recherche du bouton de soumission...")
    try:
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        print(f"    Bouton trouvé: {submit_button.text}")
    except:
        print("    Bouton submit NON trouvé avec button[type='submit']")
        # Chercher tous les boutons
        buttons = driver.find_elements(By.TAG_NAME, "button")
        print(f"\n    Boutons trouvés ({len(buttons)}):")
        for btn in buttons:
            print(f"      - text='{btn.text}', type={btn.get_attribute('type')}")
        if buttons:
            submit_button = buttons[0]
            print(f"\n    Utilisation du premier bouton: {submit_button.text}")
        else:
            driver.quit()
            exit()
    
    # 5. Soumettre
    print("\n 5️ Soumission du formulaire...")
    submit_button.click()
    print("    Clic effectué")
    
    # 6. Attendre et vérifier
    print("\n 6️ Attente de la redirection...")
    time.sleep(3)
    print(f"   URL après soumission: {driver.current_url}")
    print(f"   Titre: {driver.title}")
    
    # Vérifier s'il y a des messages d'erreur
    try:
        error_elements = driver.find_elements(By.CSS_SELECTOR, ".error, .alert, [role='alert'], .text-red-500, .text-danger")
        if error_elements:
            print("\n    Messages d'erreur trouvés:")
            for err in error_elements:
                if err.text:
                    print(f"      - {err.text}")
    except:
        pass
    
    if "dashboard" in driver.current_url.lower():
        print("\n SUCCÈS - Redirection vers dashboard détectée!")
    else:
        print("\n ÉCHEC - Pas de redirection vers dashboard")
        print("   Vérifiez que:")
        print("   - Le backend est démarré (php artisan serve)")
        print("   - Le frontend est démarré (npm run dev)")
        print("   - Les comptes de test existent dans la base de données")
    
    print("\n⏸ Pause de 5 secondes pour observer...")
    time.sleep(5)
    
except Exception as e:
    print(f"\n ERREUR CRITIQUE: {e}")
    import traceback
    traceback.print_exc()

finally:
    driver.quit()
    print("\n Navigateur fermé")
