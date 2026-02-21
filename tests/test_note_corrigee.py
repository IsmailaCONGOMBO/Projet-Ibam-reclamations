from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

print("=" * 60)
print("🚀 TEST DE FUMÉE - VALIDATION NOUVELLE NOTE (0-20)")
print("=" * 60)

driver = webdriver.Chrome()
driver.maximize_window()

try:
    # 1. Connexion enseignant
    print("\n1️⃣ Connexion enseignant...")
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
    print("   ✓ Connexion réussie")
    
    # 2. Aller sur "Réclamations à traiter"
    print("\n2️⃣ Navigation vers 'Réclamations à traiter'...")
    time.sleep(2)
    try:
        reclamations_link = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(., 'Réclamations à traiter') or contains(., 'traiter')]"))
        )
        reclamations_link.click()
    except:
        menu_items = driver.find_elements(By.TAG_NAME, "a")
        for item in menu_items:
            if "traiter" in item.text.lower():
                item.click()
                break
    
    time.sleep(2)
    print("   ✓ Page ouverte")
    
    # 3. Cliquer sur "Traiter"
    print("\n3️⃣ Ouverture du formulaire de traitement...")
    traiter_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "(//button[contains(., 'Traiter')])[1]"))
    )
    traiter_button.click()
    time.sleep(2)
    print("   ✓ Formulaire ouvert")
    
    # 4. Remplir le commentaire
    print("\n4️⃣ Remplissage du commentaire...")
    try:
        commentaire = driver.find_element(By.CSS_SELECTOR, "textarea")
        commentaire.send_keys("Test de validation des notes")
        print("   ✓ Commentaire rempli")
    except:
        print("   ⚠️ Commentaire non trouvé")
    
    # 5. Cocher "Valider la réclamation (Correction note)"
    print("\n5️⃣ Sélection de la décision 'Correction note'...")
    correction_radio = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//label[contains(., 'Valider') and contains(., 'Correction')]//input | //input[@value='validee']"))
    )
    driver.execute_script("arguments[0].click();", correction_radio)
    time.sleep(1)
    print("   ✓ Décision cochée")
    
    # 6. Trouver le champ "Nouvelle note"
    print("\n6️⃣ Recherche du champ 'Nouvelle note'...")
    note_input = None
    try:
        note_input = driver.find_element(By.XPATH, "//label[contains(., 'Nouvelle note')]/following::input[1]")
    except:
        try:
            note_input = driver.find_element(By.CSS_SELECTOR, "input[placeholder*='nouvelle'], input[placeholder*='Nouvelle']")
        except:
            try:
                note_input = driver.find_element(By.NAME, "nouvelle_note")
            except:
                inputs = driver.find_elements(By.CSS_SELECTOR, "input[type='number']")
                if inputs:
                    note_input = inputs[-1]
    
    if not note_input:
        print("   ❌ Champ 'Nouvelle note' non trouvé")
        driver.quit()
        exit()
    
    print("   ✓ Champ trouvé")
    
    # 7. Tester les différentes valeurs
    print("\n7️⃣ Tests de validation...")
    print("=" * 60)
    
    tests = [
        ("0", True, "Note minimale valide"),
        ("10", True, "Note moyenne valide"),
        ("20", True, "Note maximale valide"),
        ("15.5", True, "Note décimale valide"),
        ("12.75", True, "Note décimale valide"),
        ("-1", False, "Note négative invalide"),
        ("21", False, "Note > 20 invalide"),
        ("25", False, "Note très supérieure invalide"),
        ("-5", False, "Note négative invalide"),
    ]
    
    resultats = []
    for note_value, should_pass, description in tests:
        note_input.clear()
        time.sleep(0.5)
        note_input.send_keys(note_value)
        time.sleep(0.5)
        
        is_valid = driver.execute_script("return arguments[0].validity.valid;", note_input)
        
        if should_pass:
            success = is_valid
            status = "✅" if success else "❌"
        else:
            success = not is_valid
            status = "✅" if success else "❌"
        
        resultats.append((note_value, should_pass, success))
        print(f"{status} Note {note_value:>6} - {description}")
    
    # Résumé
    print("\n" + "=" * 60)
    print("📊 RÉSUMÉ")
    print("=" * 60)
    total = len(resultats)
    passes = sum(1 for _, _, s in resultats if s)
    print(f"Total: {passes}/{total} tests réussis")
    print("=" * 60)
    
    print("\n⏸️ Pause de 3 secondes...")
    time.sleep(3)
    
except Exception as e:
    print(f"\n❌ ERREUR: {e}")
    import traceback
    traceback.print_exc()

finally:
    driver.quit()
    print("\n✅ Test terminé")
