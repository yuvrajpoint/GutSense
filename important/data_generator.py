import random
import pandas as pd

NUM_SAMPLES = 10000
RANDOM_SEED = 42
random.seed(RANDOM_SEED)

STOOL_TYPES = [1, 2, 3, 4, 5, 6, 7]  # Bristol Stool Chart
STOOL_COLORS = ["brown", "yellow", "green"]
WATER_LEVELS = ["low", "medium", "high"]
FIBER_LEVELS = ["low", "medium", "high"]
FOOD_TYPES = ["spicy", "oily", "dairy", "fiber_rich", "junk", "normal"]
SYMPTOMS_POOL = ["bloating", "abdominal_pain", "nausea", "cramps"]

CONDITIONS = [
    "Healthy",
    "Constipation",
    "Diarrhea",
    "Dehydration",
    "Indigestion",
    "Food_Intolerance"
]

def choose(options):
    return random.choice(options)

def chance(p):
    """Returns True with probability p"""
    return random.random() < p

def generate_single_record():
    stool_type = choose(STOOL_TYPES)
    stool_color = choose(STOOL_COLORS)
    water_intake = choose(WATER_LEVELS)
    fiber_intake = choose(FIBER_LEVELS)
    food_type = choose(FOOD_TYPES)
    stress_level = random.randint(0, 2)  # 0=low, 1=medium, 2=high
    time_since_meal = random.randint(1, 8)  # hours

    symptoms = set()

    # Symptom generation (clinically inspired)
    if stool_type in [6, 7]:
        symptoms.add("cramps")
    if stool_type in [1, 2]:
        symptoms.add("abdominal_pain")
    if stress_level == 2:
        symptoms.add("bloating")
    if food_type in ["spicy", "oily"]:
        symptoms.add("nausea")

    label = "Healthy"

    # CONSTIPATION
    if stool_type in [1, 2] and water_intake == "low" and fiber_intake == "low":
        if chance(0.95):
            label = "Constipation"

    # DIARRHEA
    elif stool_type in [6, 7]:
        if chance(0.80):
            label = "Diarrhea"

    # DEHYDRATION
    elif water_intake == "low" and stool_type in [3, 4]:
        if chance(0.65):
            label = "Dehydration"

    # FOOD INTOLERANCE
    elif food_type == "dairy" and stool_type in [5, 6] and "bloating" in symptoms:
        if chance(0.70):
            label = "Food_Intolerance"

    # INDIGESTION
    elif food_type in ["spicy", "oily", "junk"] and stool_type in [4, 5]:
        if chance(0.60):
            label = "Indigestion"

    # HEALTHY
    elif stool_type in [3, 4] and len(symptoms) == 0:
        if chance(0.90):
            label = "Healthy"

    return {
        "stool_type": stool_type,
        "stool_color": stool_color,
        "water_intake": water_intake,
        "fiber_intake": fiber_intake,
        "food_type": food_type,
        "stress_level": stress_level,
        "time_since_meal_hours": time_since_meal,
        "symptoms": "|".join(sorted(symptoms)),
        "label": label
    }

def generate_dataset(n_samples):
    records = []
    for _ in range(n_samples):
        records.append(generate_single_record())
    return pd.DataFrame(records)

if __name__ == "__main__":
    df = generate_dataset(NUM_SAMPLES)

    # Shuffle dataset
    df = df.sample(frac=1, random_state=RANDOM_SEED).reset_index(drop=True)

    # Save
    df.to_csv("gut_health_synthetic_dataset.csv", index=False)

    # Display summary
    print("\nDataset generated successfully!\n")
    print("Label distribution:\n")
    print(df["label"].value_counts(normalize=True).round(3))
