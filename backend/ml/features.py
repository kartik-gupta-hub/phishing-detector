import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

def extract_url_features(url: str):
    parsed_url = urlparse(url)
    
    # Feature 1: Length of URL
    url_length = len(url)
    
    # Feature 2: Presence of special characters (@, -, //)
    has_at_symbol = 1 if '@' in url else 0
    has_dash = 1 if '-' in parsed_url.netloc else 0
    
    # Feature 3: Use of HTTPS
    is_https = 1 if parsed_url.scheme == 'https' else 0
    
    # Feature 4: Number of subdomains
    # Simply count dots in the netloc after removing 'www.'
    domain = parsed_url.netloc.replace('www.', '')
    num_subdomains = domain.count('.')
    
    # Feature 5: IP Address in URL
    ip_pattern = re.compile(r'(([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5]))')
    has_ip = 1 if ip_pattern.findall(domain) else 0

    return {
        "url_length": float(url_length),
        "has_at_symbol": float(has_at_symbol),
        "has_dash": float(has_dash),
        "is_https": float(is_https),
        "num_subdomains": float(num_subdomains),
        "has_ip": float(has_ip)
    }

def extract_html_features(url: str):
    default_html_features = {
        "has_iframe": 0.0,
        "external_scripts_ratio": 0.0,
        "empty_form_actions": 0.0,
        "hidden_elements": 0.0,
        "redirect_behavior": 0.0
    }
    
    try:
        # We need a proper user agent so we aren't immediately blocked
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        response = requests.get(url, headers=headers, timeout=5, allow_redirects=True)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Feature: Redirects
        # If the history contains redirects
        if len(response.history) > 0:
            default_html_features["redirect_behavior"] = 1.0
            
        # Feature: Iframes
        iframes = soup.find_all('iframe')
        default_html_features["has_iframe"] = 1.0 if len(iframes) > 0 else 0.0

        # Feature: External scripts
        scripts = soup.find_all('script')
        external_scripts = [s for s in scripts if s.get('src') and not urlparse(url).netloc in urlparse(s.get('src')).netloc]
        if len(scripts) > 0:
            default_html_features["external_scripts_ratio"] = float(len(external_scripts) / len(scripts))

        # Feature: Forms with empty/suspicious action
        forms = soup.find_all('form')
        suspicious_forms = [f for f in forms if not f.get('action') or f.get('action') == '#' or f.get('action').startswith('javascript')]
        default_html_features["empty_form_actions"] = 1.0 if len(suspicious_forms) > 0 else 0.0

        # Feature: Hidden elements
        hidden_elements = soup.find_all(style=re.compile(r'display:\s*none|visibility:\s*hidden'))
        default_html_features["hidden_elements"] = 1.0 if len(hidden_elements) > 0 else 0.0

    except Exception:
        # If we fail to fetch (timeout, no resolving), that itself is highly suspicious 
        # but we lack HTML features. We'll return 0s or conservative estimates.
        pass
        
    return default_html_features

def extract_all_features(url: str):
    url_features = extract_url_features(url)
    html_features = extract_html_features(url)
    
    # Merge dictionaries
    features = {**url_features, **html_features}
    
    # Ordered list of features corresponding to training data
    feature_keys = [
        "url_length", "has_at_symbol", "has_dash", "is_https", "num_subdomains", "has_ip",
        "has_iframe", "external_scripts_ratio", "empty_form_actions", "hidden_elements", "redirect_behavior"
    ]
    
    feature_vector = [features[k] for k in feature_keys]
    return feature_vector, features
