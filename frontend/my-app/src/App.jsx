import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("/Teildatensatz.json")
      .then((r) => r.json())
      .then((data) => setRows(data));
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Bahnhofstrasse Projekt</h1>
      </header>

      <main>
        <h2>Daten</h2>
        <p>Geladene Zeilen: {rows.length}</p>
      </main>
    </div>
  );
}
