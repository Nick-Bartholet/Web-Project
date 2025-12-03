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