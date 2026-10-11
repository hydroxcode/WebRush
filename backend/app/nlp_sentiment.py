import re
from typing import Tuple, Dict, Any, List

# Core Lexicon dictionaries with weighted valence
POSITIVE_WORDS = {
    "outstanding": 3.0, "excellent": 2.8, "innovative": 2.6, "helpful": 2.2, "durable": 2.4,
    "recommended": 2.2, "greatly": 2.0, "improved": 2.0, "responsive": 2.2, "resolved": 2.4,
    "knowledgeable": 2.3, "promptly": 2.0, "useful": 2.0, "love": 2.5, "great": 2.2,
    "perfect": 2.8, "amazing": 2.8, "fast": 1.8, "impressed": 2.3, "satisfied": 2.1,
    "smooth": 1.9, "reliable": 2.4, "wonderful": 2.6, "appreciated": 2.0, "seamless": 2.2,
    "best": 2.5, "good": 1.5, "exceeded": 2.5, "pleased": 2.0, "effective": 2.0
}

NEGATIVE_WORDS = {
    "scam": -3.5, "fraud": -3.5, "fraudulent": -3.5, "scammed": -3.5, "stole": -3.2,
    "stolen": -3.2, "crashing": -2.8, "crash": -2.8, "crashed": -2.8, "damaged": -2.6,
    "missing": -2.5, "defects": -2.5, "defective": -2.5, "unresponsive": -2.8, "disappointed": -2.4,
    "unresolved": -2.5, "incorrectly": -2.3, "wrong": -2.2, "delayed": -2.0, "stopped": -2.0,
    "broken": -2.8, "terrible": -3.0, "worst": -3.2, "horrible": -3.0, "failed": -2.5,
    "failure": -2.5, "poor": -2.2, "bad": -2.0, "beware": -2.8, "useless": -2.6,
    "waste": -2.7, "frustrated": -2.4, "disaster": -3.0, "unacceptable": -2.8, "victim": -3.0
}

INTENSIFIERS = {
    "very": 1.3, "extremely": 1.6, "incredibly": 1.5, "greatly": 1.4, "highly": 1.4,
    "completely": 1.5, "totally": 1.4, "really": 1.3, "severely": 1.6, "deeply": 1.4
}

NEGATIONS = {"not", "never", "no", "neither", "nor", "hardly", "barely", "scarcely", "cannot", "unresolved"}

URGENCY_KEYWORDS = {
    "scam": 0.95, "fraud": 0.95, "fraudulent": 0.95, "scammed": 0.95, "victim": 0.90,
    "police": 0.95, "stolen": 0.90, "unauthorized": 0.90, "additional payment": 0.90,
    "crashing": 0.85, "crashed": 0.85, "missing items": 0.85, "damaged": 0.80,
    "wrong items": 0.80, "unresponsive": 0.75, "stopped working": 0.75, "charged": 0.70,
    "delayed": 0.65, "defective": 0.70, "never received": 0.90
}

def clean_text(text: str) -> str:
    return re.sub(r'\s+', ' ', text).strip()

def analyze_sentiment(text: str) -> Tuple[str, float, float]:
    """
    Returns (sentiment_label, sentiment_score, urgency_score)
    sentiment_score ranges from -1.0 (most negative) to +1.0 (most positive)
    urgency_score ranges from 0.0 to 1.0
    """
    if not text:
        return ("neutral", 0.0, 0.0)

    lower_text = text.lower()
    words = re.findall(r'\b[a-z\'-]+\b', lower_text)

    pos_score = 0.0
    neg_score = 0.0
    multiplier = 1.0
    is_negated = False

    for i, word in enumerate(words):
        # Lookback for negation
        if word in NEGATIONS:
            is_negated = True
            continue

        if word in INTENSIFIERS:
            multiplier = INTENSIFIERS[word]
            continue

        weight = 1.0 * multiplier
        multiplier = 1.0  # reset multiplier

        if word in POSITIVE_WORDS:
            val = POSITIVE_WORDS[word] * weight
            if is_negated:
                neg_score += val * 0.85
            else:
                pos_score += val
            is_negated = False
        elif word in NEGATIVE_WORDS:
            val = abs(NEGATIVE_WORDS[word]) * weight
            if is_negated:
                pos_score += val * 0.5
            else:
                neg_score += val
            is_negated = False
        else:
            # Decay negation over max 3 words
            if i > 0 and words[i-1] not in NEGATIONS:
                is_negated = False

    total_magnitude = pos_score + neg_score
    if total_magnitude == 0:
        raw_score = 0.0
    else:
        raw_score = (pos_score - neg_score) / (pos_score + neg_score + 1.0)
    
    # Bound between -1.0 and 1.0
    sentiment_score = max(-1.0, min(1.0, round(raw_score, 3)))

    if sentiment_score >= 0.15:
        sentiment = "positive"
    elif sentiment_score <= -0.15:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    # Compute urgency
    urgency = 0.1
    for kw, u_val in URGENCY_KEYWORDS.items():
        if kw in lower_text:
            urgency = max(urgency, u_val)
    
    if sentiment == "negative" and urgency < 0.5:
        urgency = 0.55

    return (sentiment, sentiment_score, round(urgency, 2))

# Theme definition dictionary for clustering recurring topics
THEME_DEFINITIONS = [
    {
        "id": "fraud_payment_extortion",
        "title": "Seller Payment Extortion & Fake Extra Charges",
        "category": "Fraud and Scam",
        "pattern": r"additional payment|demanded extra|fraud|scam|scammed|victim",
        "severity": "Critical",
        "root_cause": "Rogue 3rd-party sellers requesting off-platform payments or threatening delivery withholding.",
        "action": "Enforce strict escrow validation, instant seller account freeze on off-platform payment reports, and automated fraud warning banners during checkout."
    },
    {
        "id": "undelivered_order_fraud",
        "title": "Undelivered Orders Despite Payment Confirmation",
        "category": "Fraud and Scam",
        "pattern": r"never received|not received.*charged|charged.*never|not as advertised",
        "severity": "Critical",
        "root_cause": "Ghost tracking numbers issued by unverified merchants without physical fulfillment.",
        "action": "Hold merchant payout until carrier API confirms parcel handover and first delivery scan."
    },
    {
        "id": "damaged_packaging_missing_items",
        "title": "Transit Damage & Missing Package Items",
        "category": "Operational Issues",
        "pattern": r"packaging was damaged|damaged.*missing|missing.*order|arrived.*broken|defects",
        "severity": "High",
        "root_cause": "Inadequate bubble cushioning, poor sealing tape quality, and rough handling in 3PL sorting hubs.",
        "action": "Audit logistics partners with >2% damage rate, require tamper-evident reinforced sealing tapes, and initiate instant no-hassle item reshipments."
    },
    {
        "id": "wrong_order_fulfillment",
        "title": "Incorrect Item Fulfillment & SKU Mismatches",
        "category": "Operational Issues",
        "pattern": r"processed incorrectly|wrong items|incorrect item|wrong product",
        "severity": "High",
        "root_cause": "Warehouse barcode bin scanning discrepancy and manual packing label mixups during peak shift hours.",
        "action": "Implement mandatory double 2D-barcode scan verification at packing stations before shipping labels can be printed."
    },
    {
        "id": "checkout_website_crashes",
        "title": "Website Checkout Crashes & Order Placement Errors",
        "category": "Operational Issues",
        "pattern": r"website.*crashing|kept crashing|issues while placing|checkout.*error|order.*crashed",
        "severity": "High",
        "root_cause": "Database connection pool exhaustion and memory leak in cart session microservice under concurrent traffic.",
        "action": "Scale frontend API gateways horizontally, implement circuit breaker patterns on checkout microservices, and auto-save abandoned cart states."
    },
    {
        "id": "support_unresponsive_ticket_stall",
        "title": "Support Channel Inaction & Ticket Stall",
        "category": "Customer Service",
        "pattern": r"unresponsive|not helpful|remains unresolved|no response|ignored my ticket",
        "severity": "Medium",
        "root_cause": "Tier-1 support routing backlog without SLA escalation rules for open tickets older than 24 hours.",
        "action": "Deploy automated triage bot to route priority tickets and trigger automated manager escalation for queries waiting >4 hours."
    },
    {
        "id": "support_excellence_rapid_resolution",
        "title": "Commendations for Rapid Support & Resolution",
        "category": "Customer Service",
        "pattern": r"outstanding|resolved.*minutes|excellent assistance|incredibly helpful|knowledgeable",
        "severity": "Low",
        "root_cause": "Highly empowered frontline support agents with direct refund authority and rapid response workflows.",
        "action": "Document winning support agent resolution scripts as golden templates for training across all shifts."
    },
    {
        "id": "product_durability_innovation_praise",
        "title": "High Customer Affinity for Innovation & Durability",
        "category": "Product Feedback",
        "pattern": r"innovative features|durable|well-made|highly recommended|greatly improved",
        "severity": "Low",
        "root_cause": "Strong product-market fit, superior build materials, and intuitive core feature design.",
        "action": "Feature customer praise quotes prominently in marketing campaigns and double down on feature roadmap."
    },
    {
        "id": "product_premature_failure",
        "title": "Premature Hardware Failure & Quality Drop",
        "category": "Product Feedback",
        "pattern": r"did not meet.*expectations|stopped working|broke after|stopped after a week",
        "severity": "High",
        "root_cause": "Component thermal stress or battery degradation from batch QC variance in supplier assembly.",
        "action": "Initiate lot inspection with factory suppliers, extend free replacement warranty to 1 year, and notify affected batch purchasers."
    }
]

def extract_theme_for_review(review: str, category: str) -> Dict[str, Any]:
    text_lower = review.lower()
    for theme in THEME_DEFINITIONS:
        if re.search(theme["pattern"], text_lower, re.IGNORECASE):
            return theme
    # Default fallback
    return {
        "id": f"general_{category.lower().replace(' ', '_')}",
        "title": f"General {category} Inquiries",
        "category": category,
        "pattern": "",
        "severity": "Medium",
        "root_cause": f"General feedback patterns in {category} requiring continuous monitoring.",
        "action": f"Review direct customer quotes in {category} to identify emerging patterns."
    }
