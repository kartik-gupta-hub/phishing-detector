import os
from sklearn.ensemble import RandomForestClassifier
import joblib
import numpy as np

def generate_synthetic_data(num_samples=1000):
    """
    Generate a simple synthetic dataset modeling standard phishing behaviors
    so the MVP is runnable and functional instantly.
    11 Features (in order):
    [0] url_length
    [1] has_at_symbol
    [2] has_dash
    [3] is_https
    [4] num_subdomains
    [5] has_ip
    [6] has_iframe
    [7] external_scripts_ratio
    [8] empty_form_actions
    [9] hidden_elements
    [10] redirect_behavior
    """
    X = []
    y = []
    
    for _ in range(num_samples):
        is_phishing = np.random.choice([0, 1])
        
        if is_phishing:
            url_length = np.random.uniform(50, 150)
            has_at_symbol = np.random.choice([0, 1], p=[0.8, 0.2])
            has_dash = np.random.choice([0, 1], p=[0.3, 0.7])
            is_https = np.random.choice([0, 1], p=[0.6, 0.4])
            num_subdomains = np.random.uniform(2, 6)
            has_ip = np.random.choice([0, 1], p=[0.9, 0.1])
            has_iframe = np.random.choice([0, 1], p=[0.4, 0.6])
            external_scripts_ratio = np.random.uniform(0.5, 1.0)
            empty_form_actions = np.random.choice([0, 1], p=[0.3, 0.7])
            hidden_elements = np.random.choice([0, 1], p=[0.5, 0.5])
            redirect_behavior = np.random.choice([0, 1], p=[0.4, 0.6])
        else:
            url_length = np.random.uniform(20, 80)
            has_at_symbol = 0
            has_dash = np.random.choice([0, 1], p=[0.8, 0.2])
            is_https = 1
            num_subdomains = np.random.uniform(1, 3)
            has_ip = 0
            has_iframe = np.random.choice([0, 1], p=[0.9, 0.1])
            external_scripts_ratio = np.random.uniform(0.0, 0.4)
            empty_form_actions = 0
            hidden_elements = np.random.choice([0, 1], p=[0.9, 0.1])
            redirect_behavior = np.random.choice([0, 1], p=[0.9, 0.1])
            
        x_row = [
            url_length, has_at_symbol, has_dash, is_https, num_subdomains, has_ip,
            has_iframe, external_scripts_ratio, empty_form_actions, hidden_elements, redirect_behavior
        ]
        
        X.append(x_row)
        y.append(is_phishing)
        
    return np.array(X), np.array(y)

def train_and_save_model(model_path="ml/model.joblib"):
    print("Generating synthetic data...")
    X, y = generate_synthetic_data(2000)
    
    print("Training Random Forest Classifier...")
    clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    clf.fit(X, y)
    
    # Save the model
    dirname = os.path.dirname(model_path)
    if dirname:
        os.makedirs(dirname, exist_ok=True)
    joblib.dump(clf, model_path)
    print(f"Model saved to {model_path}")
    
def load_model(model_path="ml/model.joblib"):
    # If the model does not exist, train one automatically
    if not os.path.exists(model_path):
        train_and_save_model(model_path)
    return joblib.load(model_path)

if __name__ == "__main__":
    train_and_save_model("model.joblib")
