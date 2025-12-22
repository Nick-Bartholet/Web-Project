# Bahnhofstrasse Projekt

## Beschreibung des Projekts

Dieses Projekt ist eine Webanwendung zur Analyse und interaktiven Visualisierung
von Passantenfrequenzen entlang der Bahnhofstrasse in Zürich.
Die Anwendung besteht aus einem Backend (FastAPI) und einem Frontend
(React mit Vite), welche über eine REST-API miteinander kommunizieren.

---

## Voraussetzungen

- Node.js
- Python 3.x
- Virtuelle Python-Umgebung (`.venv`)
- Git

---

## Projektstart

### Backend - Ablauf

```bash
cd backend
.venv\Scripts\activate
pip install pandas
pip install altair
uvicorn main:app --reload
```

### Frontend - Ablauf

cd frontend/my-app
npm install
npm run dev
