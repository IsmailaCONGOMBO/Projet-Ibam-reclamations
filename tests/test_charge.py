from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import csv
from datetime import datetime

def login_user(user_id, email, password):
    """Fonction pour tester la connexion d'un utilisateur"""
    start_time = time.time()
    result = {
        'user_id': user_id,
        'email': email,
        'status': 'ÉCHEC',
        'temps_reponse': 0,
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'erreur': ''
    }
    
    driver = None
    try:
        # Options Chrome pour optimiser les performances
        chrome_options = Options()
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_argument('--disable-logging')
        chrome_options.add_argument('--log-level=3')
        chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])
        
        driver = webdriver.Chrome(options=chrome_options)
        driver.set_window_size(800, 600)
        
        # Accéder à la page de connexion
        driver.get("http://localhost:5173")
        
        # Remplir le formulaire avec timeout augmenté
        email_input = WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
        )
        email_input.send_keys(email)
        
        password_input = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        password_input.send_keys(password)
        
        # Soumettre
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
        
        # Vérifier la redirection avec timeout augmenté
        WebDriverWait(driver, 30).until(EC.url_contains("/dashboard"))
        
        # Calculer le temps de réponse
        end_time = time.time()
        result['temps_reponse'] = round(end_time - start_time, 2)
        
        if "dashboard" in driver.current_url.lower():
            result['status'] = 'SUCCÈS'
            print(f"✅ Utilisateur {user_id} ({email}) - Connecté en {result['temps_reponse']}s")
        else:
            result['erreur'] = 'Pas de redirection vers dashboard'
            print(f"❌ Utilisateur {user_id} ({email}) - Échec")
            
    except Exception as e:
        end_time = time.time()
        result['temps_reponse'] = round(end_time - start_time, 2)
        result['erreur'] = str(e)
        print(f"❌ Utilisateur {user_id} ({email}) - Erreur: {str(e)}")
    
    finally:
        if driver:
            driver.quit()
    
    return result

def save_to_csv(results, filename='test_charge_resultats.csv'):
    """Enregistrer les résultats dans un fichier CSV"""
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['user_id', 'email', 'status', 'temps_reponse', 'timestamp', 'erreur']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for result in results:
            writer.writerow(result)
    
    print(f"\n📄 Résultats enregistrés dans: {filename}")

def run_load_test():
    """Exécuter le test de charge avec 10 utilisateurs en parallèle"""
    print("=" * 70)
    print("🚀 TEST DE CHARGE - 10 UTILISATEURS EN PARALLÈLE")
    print("=" * 70)
    
    # Liste des 10 utilisateurs (on réutilise les comptes de test)
    users = [
        (1, "etudiant@ibam.bf", "password"),
        (2, "scolarite@ibam.bf", "password"),
        (3, "enseignant@ibam.bf", "password"),
        (4, "da@ibam.bf", "password"),
        (5, "etudiant@ibam.bf", "password"),
        (6, "scolarite@ibam.bf", "password"),
        (7, "enseignant@ibam.bf", "password"),
        (8, "da@ibam.bf", "password"),
        (9, "etudiant@ibam.bf", "password"),
        (10, "scolarite@ibam.bf", "password"),
    ]
    
    print(f"\n⏱️  Démarrage du test à {datetime.now().strftime('%H:%M:%S')}")
    print(f"👥 Nombre d'utilisateurs: {len(users)}")
    print("\n" + "-" * 70)
    
    start_time = time.time()
    results = []
    
    # Exécuter les connexions en parallèle (5 à la fois pour éviter la surcharge)
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(login_user, user_id, email, password) 
                   for user_id, email, password in users]
        
        for future in as_completed(futures):
            results.append(future.result())
    
    end_time = time.time()
    total_time = round(end_time - start_time, 2)
    
    # Statistiques
    print("\n" + "=" * 70)
    print("📊 STATISTIQUES")
    print("=" * 70)
    
    success_count = sum(1 for r in results if r['status'] == 'SUCCÈS')
    fail_count = len(results) - success_count
    avg_response_time = sum(r['temps_reponse'] for r in results) / len(results)
    min_response_time = min(r['temps_reponse'] for r in results)
    max_response_time = max(r['temps_reponse'] for r in results)
    
    print(f"✅ Connexions réussies: {success_count}/{len(results)}")
    print(f"❌ Connexions échouées: {fail_count}/{len(results)}")
    print(f"⏱️  Temps total: {total_time}s")
    print(f"📈 Temps de réponse moyen: {round(avg_response_time, 2)}s")
    print(f"⚡ Temps de réponse min: {min_response_time}s")
    print(f"🐌 Temps de réponse max: {max_response_time}s")
    print(f"🎯 Taux de réussite: {round(success_count/len(results)*100, 2)}%")
    
    # Enregistrer dans CSV
    save_to_csv(results)
    
    print("\n" + "=" * 70)
    print("✅ Test de charge terminé")
    print("=" * 70)

if __name__ == "__main__":
    run_load_test()
