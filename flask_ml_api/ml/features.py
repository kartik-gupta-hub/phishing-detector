import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import tldextract

def extract_url_parts(url: str):
    """Breaks down the URL for UI visualization."""
    if not url.startswith('http'):
        url = 'https://' + url
    
    parsed = urlparse(url)
    ext = tldextract.extract(url)
    
    return {
        "protocol": parsed.scheme,
        "subdomain": ext.subdomain,
        "domain": ext.domain,
        "tld": ext.suffix,
        "path": parsed.path,
        "query": parsed.query
    }

def analyze_url_rules(url: str, parts: dict):
    """
    Returns rule-based penalty score (0-100) and a list of reasons.
    """
    reasons = []
    penalty = 0

    if parts['protocol'] != 'https':
        reasons.append("Connection is not secure (missing HTTPS).")
        penalty += 30

    if '-' in parts['domain']:
        reasons.append(f"Domain name '{parts['domain']}' contains dashes, a common obfuscation tactic.")
        penalty += 15
        
    subdomains = parts['subdomain'].split('.') if parts['subdomain'] else []
    if len(subdomains) > 2:
        reasons.append("Unusually high number of subdomains detected.")
        penalty += 20
        
    url_len = len(url)
    if url_len > 75:
        reasons.append("URL length is suspicious and may be attempting to hide the true destination.")
        penalty += 10
        
    ip_pattern = re.compile(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}')
    if ip_pattern.search(parts['domain']) or ip_pattern.search(parts['subdomain']):
        reasons.append("URL uses an IP address instead of a standard domain name.")
        penalty += 40

    return min(penalty, 100), reasons

def extract_url_ml_features(url: str):
    """Extracts features needed for ML model."""
    parsed_url = urlparse(url if url.startswith('http') else 'https://' + url)
    ext = tldextract.extract(url)
    
    url_length = len(url)
    has_at_symbol = 1 if '@' in url else 0
    has_dash = 1 if '-' in ext.domain else 0
    is_https = 1 if parsed_url.scheme == 'https' else 0
    num_subdomains = len(ext.subdomain.split('.')) if ext.subdomain else 0
    
    ip_pattern = re.compile(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}')
    has_ip = 1 if ip_pattern.search(ext.domain) or ip_pattern.search(ext.subdomain) else 0

    return {
        "url_length": float(url_length),
        "has_at_symbol": float(has_at_symbol),
        "has_dash": float(has_dash),
        "is_https": float(is_https),
        "num_subdomains": float(num_subdomains),
        "has_ip": float(has_ip)
    }

def analyze_email_rules(email_text: str):
    """
    Analyzes email text for phishing indicators.
    Returns penalty score and list of reasons.
    """
    reasons = []
    penalty = 0
    text_lower = email_text.lower()
    
    # Financial & urgency keywords
    urgency_words = ['urgent', 'immediately', 'within 24 hours', 'account suspended', 'verify your account', 'action required']
    financial_words = ['bank', 'invoice', 'payment', 'transfer', 'credit card', 'paypal', 'crypto', 'wallet']
    scam_hooks = ['winner', 'lottery', 'inheritance', 'gift card', 'click here to claim']
    
    found_urgency = [w for w in urgency_words if w in text_lower]
    if found_urgency:
        reasons.append(f"Contains urgency/threat triggers: {', '.join(found_urgency)}")
        penalty += 25
        
    found_financial = [w for w in financial_words if w in text_lower]
    if len(found_financial) > 1:
        reasons.append(f"Mentions financial topics: {', '.join(found_financial)}")
        penalty += 15
        
    found_scams = [w for w in scam_hooks if w in text_lower]
    if found_scams:
        reasons.append(f"Contains common scam hooks: {', '.join(found_scams)}")
        penalty += 30
        
    # Links checking
    links = re.findall(r'(https?://\S+)', email_text)
    if links:
        reasons.append(f"Contains {len(links)} external hyperlink(s). Be extremely careful before clicking.")
        penalty += 20
        # Check first link for IP
        if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', links[0]):
             reasons.append("Embedded link points to an IP address.")
             penalty += 30
             
    if penalty == 0:
        if len(email_text.split()) < 10:
             reasons.append("Email is unusually short, which can bypass some basic spam filters.")
             penalty += 10
             
    return min(penalty, 100), reasons, links

def extract_email_ml_features(email_text: str):
    """Extract features for purely structural ML email analysis.
    (Currently returns mocked features mapping to the generic RF model).
    """
    # Mapping to a generic structure for MVP purposes
    return {
        "url_length": float(len(email_text) / 10), # pseudo mapping
        "has_at_symbol": 1.0, 
        "has_dash": 1.0 if '-' in email_text else 0.0,
        "is_https": 0.0,
        "num_subdomains": 0.0,
        "has_ip": 1.0 if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', email_text) else 0.0
    }
