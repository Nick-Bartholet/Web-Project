from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import csv


# FastAPI-App erstellen


app = FastAPI(
    title="Bahnhofstrasse API",
    description="API für den Gesamtdatensatz (CSV)",

)


# CORS aktivieren, damit das React-Frontend zugreifen darf


origins = [
    "http://localhost:5173",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dateipfad für den Gesamtdatensatz (CSV)


DATA_DIR = Path(__file__).parent / "data"
GESAMT_PATH = DATA_DIR / "Gesamtdatensatz.csv"


def load_gesamtdaten():
    if not GESAMT_PATH.exists():
        return []

    rows = []
    with GESAMT_PATH.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)  # erste Zeile = Header
        for row in reader:
            rows.append(row)
    return rows
"""Lädt den gesamten Datensatz aus der CSV-Datei und gibt ihn als Liste von Dictionaries zurück."""


# Basis-Endpunkte zum Testen


@app.get("/")
def root():
    return {"message": "Bahnhofstrasse Backend (Gesamtdatensatz) läuft."}
    """Kleine Startseite zum Testen."""

@app.get("/health")
def health():
    return {"status": "ok"}
    """Health-Check-Endpunkt."""



# Daten-Endpunkte (nur Gesamtdatensatz)


@app.get("/daten")
def daten_gesamt():
    return load_gesamtdaten()
""" Gibt den gesamten Gesamtdatensatz zurück"""


@app.get("/daten/preview")
def daten_gesamt_preview():
    data = load_gesamtdaten()
    return data[:10]
"""Gibt nur die ersten 10 Zeilen des Gesamtdatensatzes zurück // für Test und Frontend-Daten"""

@app.get("/analysis/erwachsene")
def analyse_erwachsene():
    """
    Zählt erwachsene Fussgänger nach Laufrichtung
    (links / rechts) über den gesamten Datensatz.
    """
    data = load_gesamtdaten()

    links = 0
    rechts = 0

    for row in data:
        # Feldnamen ggf. an CSV anpassen
        if row.get("altersgruppe") == "Erwachsene":
            if row.get("richtung") == "links":
                links += 1
            elif row.get("richtung") == "rechts":
                rechts += 1

    return {
        "links": links,
        "rechts": rechts
    }


@app.get("/analysis/erwachsene/{standort}")
def analyse_erwachsene_standort(standort: str):
    csv_path = Path(__file__).parent / "data" / "Gesamtdatensatz.csv"

    sum_ltr = 0
    sum_rtl = 0

    with csv_path.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["location_name"] == standort:
                sum_ltr += int(row.get("adult_ltr_pedestrians_count", 0))
                sum_rtl += int(row.get("adult_rtl_pedestrians_count", 0))

    return {
        "standort": standort,
        "adult_ltr": sum_ltr,
        "adult_rtl": sum_rtl,
        "more_to_right": sum_rtl > sum_ltr
    }



@app.get("/analysis/standorte")
def list_standorte():
    csv_path = Path(__file__).parent / "data" / "Gesamtdatensatz.csv"
    standorte = set()

    with csv_path.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = (row.get("location_name") or "").strip()
            if name:
                standorte.add(name)

    return sorted(standorte)


@app.get("/debug/columns")
def debug_columns():
    csv_path = Path(__file__).parent / "data" / "Gesamtdatensatz.csv"
    with csv_path.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return {"columns": reader.fieldnames}
