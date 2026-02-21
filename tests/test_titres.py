from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time

class TestTitresFormulaires:
    def __init__(self):
        chrome_options = Options()
        chrome_options.add_argument('--disable-logging')
        chrome_options.add_argument('--log-level=3')
        chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])
        
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.maximize_window()
        self.results = []
    
    def verify_page_title(self, expected_title, description):
        """Vérifier le titre d'une page/formulaire"""
        try:
            time.sleep(1)
            
            # Chercher le titre dans différents éléments possibles
            title_found = False
            actual_title = ""
            
            # Essayer h1
            try:
                h1_elements = self.driver.find_elements(By.TAG_NAME, "h1")
                for h1 in h1_elements:
                    if h1.text.strip():
                        actual_title = h1.text.strip()
                        title_found = True
                        break
            except:
                pass
            
            # Essayer h2 si h1 non trouvé
            if not title_found:
                try:
                    h2_elements = self.driver.find_elements(By.TAG_NAME, "h2")
                    for h2 in h2_elements:
                        if h2.text.strip():
                            actual_title = h2.text.strip()
                            title_found = True
                            break
                except:
                    pass
            
            # Essayer le titre de la page
            if not title_found:
                actual_title = self.driver.title
                title_found = True
            
            # Vérifier si le titre attendu est présent
            if expected_title.lower() in actual_title.lower():
                print(f"✅ {description}")
                print(f"   Titre attendu: '{expected_title}'")
                print(f"   Titre trouvé: '{actual_title}'")
                self.results.append((description, True, actual_title))
                return True
            else:
                print(f"❌ {description}")
                print(f"   Titre attendu: '{expected_title}'")
                print(f"   Titre trouvé: '{actual_title}'")
                self.results.append((description, False, actual_title))
                return False
                
        except Exception as e:
            print(f"❌ {description} - Erreur: {e}")
            self.results.append((description, False, str(e)))
            return False
    
    def test_page_connexion(self):
        """Test 1: Vérifier le titre de la page de connexion"""
        self.driver.get("http://localhost:5173")
        time.sleep(2)
        self.verify_page_title("Bienvenue", "Page de connexion")
    
    def test_dashboard_etudiant(self):
        """Test 2: Vérifier le titre du dashboard étudiant"""
        # Connexion
        email_input = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
        )
        email_input.send_keys("etudiant@ibam.bf")
        
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        password_input.send_keys("password")
        
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
        
        time.sleep(2)
        WebDriverWait(self.driver, 10).until(EC.url_contains("/dashboard"))
        
        self.verify_page_title("IBAM", "Dashboard étudiant")
    
    def test_liste_reclamations(self):
        """Test 3: Vérifier le titre de la liste des réclamations"""
        time.sleep(2)
        try:
            reclamations_link = self.driver.find_element(By.XPATH, "//a[contains(., 'Mes réclamations') or contains(., 'réclamations')]")
            reclamations_link.click()
        except:
            links = self.driver.find_elements(By.TAG_NAME, "a")
            for link in links:
                if "reclamation" in link.text.lower():
                    link.click()
                    break
        
        time.sleep(2)
        self.verify_page_title("IBAM", "Liste des réclamations")
    
    def test_deconnexion_et_reconnexion_enseignant(self):
        """Test 4: Déconnexion et connexion enseignant"""
        # Déconnexion
        try:
            logout_button = self.driver.find_element(By.XPATH, "//button[contains(., 'Déconnexion')]")
            logout_button.click()
        except:
            buttons = self.driver.find_elements(By.TAG_NAME, "button")
            for btn in buttons:
                if "déconnex" in btn.text.lower():
                    btn.click()
                    break
        
        time.sleep(2)
        
        # Connexion enseignant
        self.driver.get("http://localhost:5173")
        
        email_input = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
        )
        email_input.send_keys("enseignant@ibam.bf")
        
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        password_input.send_keys("password")
        
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
        
        time.sleep(2)
        WebDriverWait(self.driver, 10).until(EC.url_contains("/dashboard"))
        
        self.verify_page_title("IBAM", "Dashboard enseignant")
    
    def test_reclamations_a_traiter(self):
        """Test 5: Vérifier le titre des réclamations à traiter"""
        time.sleep(2)
        try:
            traiter_link = self.driver.find_element(By.XPATH, "//a[contains(., 'traiter')]")
            traiter_link.click()
        except:
            links = self.driver.find_elements(By.TAG_NAME, "a")
            for link in links:
                if "traiter" in link.text.lower():
                    link.click()
                    break
        
        time.sleep(2)
        self.verify_page_title("IBAM", "Réclamations à traiter")
    
    def run_all_tests(self):
        """Exécuter tous les tests"""
        print("=" * 70)
        print("🧪 TEST UNITAIRE - VÉRIFICATION DES TITRES DE FORMULAIRES")
        print("=" * 70)
        print()
        
        try:
            self.test_page_connexion()
            print()
            
            self.test_dashboard_etudiant()
            print()
            
            self.test_liste_reclamations()
            print()
            
            self.test_deconnexion_et_reconnexion_enseignant()
            print()
            
            self.test_reclamations_a_traiter()
            print()
            
        except Exception as e:
            print(f"\n❌ Erreur critique: {e}")
        
        finally:
            self.driver.quit()
        
        # Résumé
        print("=" * 70)
        print("📊 RÉSUMÉ DES TESTS")
        print("=" * 70)
        
        total = len(self.results)
        success = sum(1 for _, status, _ in self.results if status)
        
        for description, status, title in self.results:
            icon = "✅" if status else "❌"
            print(f"{icon} {description}")
        
        print()
        print(f"Total: {success}/{total} tests réussis")
        print(f"Taux de réussite: {round(success/total*100, 2)}%")
        print("=" * 70)

if __name__ == "__main__":
    test = TestTitresFormulaires()
    test.run_all_tests()
