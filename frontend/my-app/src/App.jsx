import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true); // Ladezustand
  const [error, setError] = useState(null); // Fehlerzustand

  const [activatePage, setActivatePage] = useState("uebersicht");

  useEffect(() => {
    // Daten vom Backend holen (Preview des Gesamtdatensatzes)
    fetch("http://localhost:8000/daten/preview")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Antwort vom Server war nicht OK");
        }
        return response.json();
      })
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Laden der Daten:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <aside className="sidebar">
        <img src="/logo-fhnw.png" className="sidebar-logo" />

        <h1 className="sidebar-title">Menü:</h1>
        <div className="sidebar-menu">
          <button
            className="sidebar-button"
            onClick={() => setActivatePage("uebersicht")}
          >
            Übersicht
          </button>
          <button
            className="sidebar-button"
            onClick={() => setActivatePage("daten")}
          >
            Daten
          </button>
          <button
            className="sidebar-button"
            onClick={() => setActivatePage("visualisierungen")}
          >
            Visualisierungen
          </button>
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

              {loading && <p>Daten werden geladen...</p>}

              {error && (
                <p style={{ color: "red" }}>
                  Fehler beim Laden der Daten: {error}
                </p>
              )}

              {!loading && !error && (
                <>
                  <p>Zeilen im Preview: {rows.length}</p>

                  {rows.length > 0 ? (
                    <table className="data-table">
                      <thead>
                        <tr>
                          {Object.keys(rows[0]).map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, index) => (
                          <tr key={index}>
                            {Object.keys(rows[0]).map((key) => (
                              <td key={key}>{row[key]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Keine Daten gefunden.</p>
                  )}
                </>
              )}
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
