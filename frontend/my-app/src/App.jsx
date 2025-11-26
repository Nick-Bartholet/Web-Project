import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [rows, setRows] = useState([]);

  const [activatePage, setActivatePage] = useState("uebersicht");

  useEffect(() => {
    fetch("/Teildatensatz.json")
      .then((r) => r.json())
      .then((data) => setRows(data));
  }, []);

  return (
    <div className="app">
      <aside className="sidebar">
        <img src="/logo-fhnw.png" className="sidebar-logo" />

        <h1 className="sidebar-title">Menu:</h1>

        <div className="sidebar-menu">
          <ul>
            <li onClick={() => setActivatePage("uebersicht")}>Ubersicht</li>
            <li onClick={() => setActivatePage("daten")}>Daten</li>
            <li onClick={() => setActivatePage("visualisierungen")}>
              Visualisierungen
            </li>
          </ul>
        </div>
      </aside>

      <div className="right-side">
        <header className="page-header">
          <h1>Bahnhofstrasse Projekt</h1>
        </header>

        <main className="main">
          {activatePage === "uebersicht" && (
            <>
              <h2>Projektübersicht</h2>
              <p>
                In diesem Projekt analysieren wir die Passantenfrequenzen
                entlang der Bahnhofstrasse in Zürich, einer der bekanntesten
                Einkaufs- und Verkehrsachsen der Schweiz. Die Stadt Zürich
                erfasst diese Daten seit 2021 mithilfe moderner Laserscanner,
                welche anonymisierte Informationen über die Anzahl der
                vorbeigehenden Personen, ihre Gehrichtung (nach links oder nach
                rechts) sowie ihre Zugehörigkeit zur Kategorie „Erwachsene“ oder
                „Kinder“ liefern. Zusätzlich werden Wetterdaten wie Temperatur
                und Niederschlag berücksichtigt, um mögliche Zusammenhänge
                zwischen Wetterbedingungen und Fussgängerbewegungen zu erkennen.
                Ziel unseres Projekts ist es, diese vielfältigen Daten
                systematisch aufzubereiten, visuell darzustellen und
                verständlich zu interpretieren. Dadurch sollen Muster, zeitliche
                Trends und räumliche Unterschiede sichtbar werden, die wichtige
                Einblicke in das Verhalten der Passanten entlang der
                Bahnhofstrasse ermöglichen.
              </p>

              <h3>Unsere Fokusfrage</h3>
              <p>
                Wann gibt es an einem ausgewählten Standort mehr erwachsene
                Fussgänger, die nach rechts gehen, als solche, die nach links
                gehen?
              </p>
            </>
          )}

          {activatePage === "daten" && (
            <>
              <h2>Daten</h2>
              <p>Geladene Zeilen: {rows.length}</p>
            </>
          )}

          {activatePage === "visualisierungen" && (
            <>
              <h2>Visualisierungen</h2>
              <p>Hier könnten Visualisierungen angezeigt werden.</p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
