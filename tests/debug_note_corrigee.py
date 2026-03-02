from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

print(" DEBUG - Test Note Corrigée\n")

driver = webdriver.Chrome()
driver.maximize_window()

try:
    # 1. Connexion enseignant
    print(" 1️ Connexion enseignant...")
    driver.get("http://localhost:5173")
    
    email_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
    )
    email_input.send_keys("enseignant@ibam.bf")
    
    password_input = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
    password_input.send_keys("password")
    
    submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    submit_button.click()
    
    time.sleep(2)
    WebDriverWait(driver, 10).until(EC.url_contains("/dashboard"))
    print(f"   ✓ Connecté - URL: {driver.current_url}")
    
    # 2. Chercher les réclamations
    print("\n 2️ Recherche des réclamations...")
    time.sleep(3)
    
    # Afficher tous les boutons/liens disponibles
    buttons = driver.find_elements(By.TAG_NAME, "button")
    links = driver.find_elements(By.TAG_NAME, "a")
    
    print(f"    Boutons trouvés ({len(buttons)}):")
    for btn in buttons[:10]:
        if btn.text.strip():
            print(f"      - {btn.text}")
    
    print(f"\n    Liens trouvés ({len(links)}):")
    for link in links[:10]:
        if link.text.strip():
            print(f"      - {link.text} → {link.get_attribute('href')}")
    
    # 3. Essayer de cliquer sur un élément pour accéder à une réclamation
    print("\n 3️ Tentative d'accès à une réclamation...")
    clicked = False
    
    # Essayer différents sélecteurs
    selectors = [
        "//button[contains(., 'Détails')]",
        "//button[contains(., 'Traiter')]",
        "//button[contains(., 'Voir')]",
        "//a[contains(., 'Détails')]",
        "//a[contains(., 'Traiter')]",
        "//a[contains(@href, 'reclamation')]",
        "//button[contains(@class, 'detail')]",
        "//td//button",
        "//tr//a"
    ]
    
    for selector in selectors:
        try:
            element = driver.find_element(By.XPATH, selector)
            print(f"   ✓ Élément trouvé: {selector}")
            print(f"     Texte: {element.text}")
            element.click()
            clicked = True
            break
        except:
            continue
    
    if not clicked:
        print("    Aucun élément cliquable trouvé")
        print("\n    Vérifiez qu'il existe des réclamations dans la base de données")
        driver.save_screenshot("debug_no_reclamation.png")
        print("   Screenshot sauvegardée: debug_no_reclamation.png")
        driver.quit()
        exit()
    
    time.sleep(2)
    print(f"   ✓ Page ouverte - URL: {driver.current_url}")
    
    # 4. Chercher le champ "Note corrigée"
    print("\n 4️ Recherche du champ 'Note corrigée'...")
    
    # Afficher tous les inputs
    inputs = driver.find_elements(By.TAG_NAME, "input")
    print(f"    Inputs trouvés ({len(inputs)}):")
    for inp in inputs:
        print(f"      - type={inp.get_attribute('type')}, name={inp.get_attribute('name')}, placeholder={inp.get_attribute('placeholder')}")
    
    # Afficher tous les labels
    labels = driver.find_elements(By.TAG_NAME, "label")
    print(f"\n    Labels trouvés ({len(labels)}):")
    for label in labels:
        if label.text.strip():
            print(f"      - {label.text}")
    
    # Essayer de trouver le champ
    note_input = None
    methods = []
    
    try:
        note_input = driver.find_element(By.CSS_SELECTOR, "input[placeholder*='corrigée'], input[placeholder*='Corrigée']")
        methods.append("placeholder contient 'corrigée'")
    except:
        pass
    
    if not note_input:
        try:
            note_input = driver.find_element(By.NAME, "note_corrigee")
            methods.append("name='note_corrigee'")
        except:
            pass
    
    if not note_input:
        try:
            note_input = driver.find_element(By.XPATH, "//label[contains(., 'Note corrigée')]/following::input[1]")
            methods.append("label 'Note corrigée' + input suivant")
        except:
            pass
    
    if not note_input:
        try:
            note_input = driver.find_element(By.XPATH, "//label[contains(., 'corrigée')]/following::input[1]")
            methods.append("label 'corrigée' + input suivant")
        except:
            pass
    
    if not note_input:
        number_inputs = driver.find_elements(By.CSS_SELECTOR, "input[type='number']")
        if number_inputs:
            note_input = number_inputs[0]
            methods.append(f"premier input[type='number'] ({len(number_inputs)} trouvés)")
    
    if note_input:
        print(f"\n    Champ trouvé via: {', '.join(methods)}")
        print(f"      type={note_input.get_attribute('type')}")
        print(f"      name={note_input.get_attribute('name')}")
        print(f"      placeholder={note_input.get_attribute('placeholder')}")
        
        # Tester une valeur
        print("\n 5️ Test de saisie...")
        note_input.clear()
        note_input.send_keys("15")
        time.sleep(1)
        
        is_valid = driver.execute_script("return arguments[0].validity.valid;", note_input)
        print(f"   Valeur saisie: 15")
        print(f"   Validité HTML5: {is_valid}")
        
    else:
        print("\n    Champ 'Note corrigée' NON trouvé")
        driver.save_screenshot("debug_no_field.png")
        print("   Screenshot sauvegardée: debug_no_field.png")
    
    print("\n⏸ Pause de 5 secondes pour observer...")
    time.sleep(5)
    
except Exception as e:
    print(f"\n ERREUR: {e}")
    import traceback
    traceback.print_exc()
    driver.save_screenshot("debug_error.png")
    print("Screenshot sauvegardée: debug_error.png")

finally:
    driver.quit()
    print("\n Navigateur fermé")
