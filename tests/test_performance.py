from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
import csv
from datetime import datetime

class PerformanceTest:
    def __init__(self):
        chrome_options = Options()
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-logging')
        chrome_options.add_argument('--log-level=3')
        chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])
        
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.maximize_window()
        self.results = []
    
    def measure_action(self, action_name, action_func):
        """Mesurer le temps d'exécution d'une action"""
        start_time = time.time()
        try:
            action_func()
            end_time = time.time()
            response_time = round(end_time - start_time, 2)
            status = "SUCCÈS"
            error = ""
            print(f"✅ {action_name}: {response_time}s")
        except Exception as e:
            end_time = time.time()
            response_time = round(end_time - start_time, 2)
            status = "ÉCHEC"
            error = str(e)
            print(f"❌ {action_name}: {response_time}s - Erreur: {error}")
        
        self.results.append({
            'action': action_name,
            'temps_reponse': response_time,
            'status': status,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'erreur': error
        })
        
        return response_time
    
    def test_chargement_page_accueil(self):
        """Test 1: Chargement de la page d'accueil"""
        def action():
            self.driver.get("http://localhost:5173")
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
            )
        
        self.measure_action("Chargement page d'accueil", action)
    
    def test_connexion_etudiant(self):
        """Test 2: Connexion étudiant"""
        def action():
            email_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='email']")
            email_input.clear()
            email_input.send_keys("etudiant@ibam.bf")
            
            password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
            password_input.send_keys("password")
            
            submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            submit_button.click()
            
            WebDriverWait(self.driver, 10).until(EC.url_contains("/dashboard"))
        
        self.measure_action("Connexion étudiant", action)
    
    def test_chargement_dashboard(self):
        """Test 3: Chargement du dashboard"""
        def action():
            time.sleep(2)
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
        
        self.measure_action("Chargement dashboard", action)
    
    def test_navigation_reclamations(self):
        """Test 4: Navigation vers liste des réclamations"""
        def action():
            time.sleep(1)
            try:
                reclamations_link = WebDriverWait(self.driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, "//a[contains(., 'Mes réclamations') or contains(., 'réclamations')]"))
                )
                reclamations_link.click()
            except:
                links = self.driver.find_elements(By.TAG_NAME, "a")
                for link in links:
                    if "reclamation" in link.text.lower():
                        link.click()
                        break
            time.sleep(2)
        
        self.measure_action("Navigation vers réclamations", action)
    
    def test_deconnexion(self):
        """Test 5: Déconnexion"""
        def action():
            time.sleep(1)
            try:
                logout_button = self.driver.find_element(By.XPATH, "//button[contains(., 'Déconnexion') or contains(., 'Déconnecter')]")
                logout_button.click()
            except:
                buttons = self.driver.find_elements(By.TAG_NAME, "button")
                for btn in buttons:
                    if "déconnex" in btn.text.lower():
                        btn.click()
                        break
            time.sleep(2)
        
        self.measure_action("Déconnexion", action)
    
    def test_connexion_enseignant(self):
        """Test 6: Connexion enseignant"""
        def action():
            self.driver.get("http://localhost:5173")
            
            email_input = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
            )
            email_input.send_keys("enseignant@ibam.bf")
            
            password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
            password_input.send_keys("password")
            
            submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            submit_button.click()
            
            WebDriverWait(self.driver, 10).until(EC.url_contains("/dashboard"))
        
        self.measure_action("Connexion enseignant", action)
    
    def test_acces_reclamations_traiter(self):
        """Test 7: Accès aux réclamations à traiter"""
        def action():
            time.sleep(2)
            try:
                traiter_link = WebDriverWait(self.driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, "//a[contains(., 'traiter')]"))
                )
                traiter_link.click()
            except:
                links = self.driver.find_elements(By.TAG_NAME, "a")
                for link in links:
                    if "traiter" in link.text.lower():
                        link.click()
                        break
            time.sleep(2)
        
        self.measure_action("Accès réclamations à traiter", action)
    
    def save_to_csv(self, filename='test_performance_resultats.csv'):
        """Enregistrer les résultats dans un fichier CSV"""
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['action', 'temps_reponse', 'status', 'timestamp', 'erreur']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            writer.writeheader()
            for result in self.results:
                writer.writerow(result)
        
        print(f"\n📄 Résultats enregistrés dans: {filename}")
    
    def run_all_tests(self):
        """Exécuter tous les tests de performance"""
        print("=" * 70)
        print("🚀 TEST DE PERFORMANCE - TEMPS DE RÉPONSE DES ACTIONS")
        print("=" * 70)
        print(f"\n⏱️  Démarrage: {datetime.now().strftime('%H:%M:%S')}\n")
        
        try:
            self.test_chargement_page_accueil()
            self.test_connexion_etudiant()
            self.test_chargement_dashboard()
            self.test_navigation_reclamations()
            self.test_deconnexion()
            self.test_connexion_enseignant()
            self.test_acces_reclamations_traiter()
            
        except Exception as e:
            print(f"\n❌ Erreur critique: {e}")
        
        finally:
            self.driver.quit()
        
        # Statistiques
        print("\n" + "=" * 70)
        print("📊 STATISTIQUES")
        print("=" * 70)
        
        success_count = sum(1 for r in self.results if r['status'] == 'SUCCÈS')
        total = len(self.results)
        avg_time = sum(r['temps_reponse'] for r in self.results) / total if total > 0 else 0
        
        print(f"✅ Actions réussies: {success_count}/{total}")
        print(f"❌ Actions échouées: {total - success_count}/{total}")
        print(f"📈 Temps de réponse moyen: {round(avg_time, 2)}s")
        print(f"🎯 Taux de réussite: {round(success_count/total*100, 2)}%")
        
        # Actions les plus lentes
        sorted_results = sorted(self.results, key=lambda x: x['temps_reponse'], reverse=True)
        print(f"\n🐌 Top 3 actions les plus lentes:")
        for i, result in enumerate(sorted_results[:3], 1):
            print(f"   {i}. {result['action']}: {result['temps_reponse']}s")
        
        # Actions les plus rapides
        print(f"\n⚡ Top 3 actions les plus rapides:")
        for i, result in enumerate(reversed(sorted_results[-3:]), 1):
            print(f"   {i}. {result['action']}: {result['temps_reponse']}s")
        
        self.save_to_csv()
        
        print("\n" + "=" * 70)
        print("✅ Test de performance terminé")
        print("=" * 70)

if __name__ == "__main__":
    test = PerformanceTest()
    test.run_all_tests()
