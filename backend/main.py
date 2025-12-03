from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    """Einfache Startseite des Backends."""
    return {"message": "Backend läuft!"}

@app.get("/gruezi/{name}")
@app.get("/gruezi")
def greet_user(name: str = "Niko"):
    """Grüsst den Nutzer mit Namen."""
    return f"Grüezi, {name}!"

