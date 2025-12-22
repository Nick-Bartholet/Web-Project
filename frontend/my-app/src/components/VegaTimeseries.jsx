import { useEffect, useMemo, useState } from "react";
import vegaEmbed from "vega-embed";

const API_BASE = "http://localhost:8000";

/**
 * Verfügbare Visualisierungstypen
 * key   → interner Wert
 * label → Anzeige im Dropdown
 * fields→ welche Felder aus dem Backend visualisiert werden
 */
const VISUALISIERUNGEN = [
  {
    key: "direction",
    label: "Links / Rechts",
    fields: ["ltr", "rtl"],
  },
  {
    key: "age",
    label: "Erwachsene / Kinder",
    fields: ["adult", "child"],
  },
  {
    key: "total",
    label: "Total Fussgänger",
    fields: ["total"],
  },
  {
    key: "zones",
    label: "Zonen 1–3",
    fields: ["zone1", "zone2", "zone3"],
  },
];

export default function VegaTimeseries({ standort }) {
  const [rows, setRows] = useState([]);
  const [visKey, setVisKey] = useState("direction");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ===============================
     Daten vom Backend laden
     =============================== */
  useEffect(() => {
    if (!standort) return;

    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/timeseries/${encodeURIComponent(standort)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Zeitreihen-Daten konnten nicht geladen werden");
        }
        return res.json();
      })
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [standort]);

  /* ===============================
     Ausgewählte Visualisierung
     =============================== */
  const selectedVis = useMemo(
    () => VISUALISIERUNGEN.find((v) => v.key === visKey) ?? VISUALISIERUNGEN[0],
    [visKey]
  );

  /* ===============================
     Vega-Lite Spec erzeugen
     =============================== */
  const spec = useMemo(() => {
    const fields = selectedVis.fields;
    const multipleLines = fields.length > 1;

    return {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      width: 720,
      height: 320,
      data: { values: rows },

      //  Zoom / Pan (Drag-Bereich aufziehen)
      params: [
        {
          name: "zoom",
          select: { type: "interval", encodings: ["x"] },
        },
      ],

      transform: multipleLines
        ? [
            // fold macht (serie, value)
            { fold: fields, as: ["serie", "value"] },

            //  deutsche Labels für Legende + Tooltip
            {
              calculate:
                "datum.serie === 'ltr' ? 'Nach links' :" +
                "datum.serie === 'rtl' ? 'Nach rechts' :" +
                "datum.serie === 'adult' ? 'Erwachsene' :" +
                "datum.serie === 'child' ? 'Kinder' :" +
                "datum.serie === 'zone1' ? 'Zone 1' :" +
                "datum.serie === 'zone2' ? 'Zone 2' :" +
                "datum.serie === 'zone3' ? 'Zone 3' :" +
                "datum.serie === 'total' ? 'Total' : datum.serie",
              as: "serie_label",
            },
          ]
        : [],

      mark: {
        type: "line",
        tooltip: true,
        interpolate: "monotone",
      },

      encoding: {
        x: {
          field: "timestamp",
          type: "temporal",
          title: "Zeit",
          //  Zoom wirkt hier
          scale: { domain: { param: "zoom" } },
        },
        y: {
          field: multipleLines ? "value" : fields[0],
          type: "quantitative",
          title: "Anzahl Fussgänger",
          //  Tausendertrennzeichen
          axis: { format: ",.0f" },
        },

        ...(multipleLines
          ? {
              color: {
                field: "serie_label",
                type: "nominal",
                title: "Kategorie",
              },
              tooltip: [
                { field: "timestamp", type: "temporal", title: "Zeit" },
                { field: "serie_label", type: "nominal", title: "Kategorie" },
                {
                  field: "value",
                  type: "quantitative",
                  title: "Anzahl",
                  format: ",.0f",
                },
              ],
            }
          : {
              tooltip: [
                { field: "timestamp", type: "temporal", title: "Zeit" },
                {
                  field: fields[0],
                  type: "quantitative",
                  title: "Anzahl",
                  format: ",.0f",
                },
              ],
            }),
      },
    };
  }, [rows, selectedVis]);

  /* ===============================
     Chart rendern
     =============================== */
  useEffect(() => {
    const el = document.getElementById("vega-timeseries");
    if (!el) return;

    vegaEmbed(el, spec, {
      actions: true, // Download / View Source etc.
    }).catch(console.error);
  }, [spec]);

  /* ===============================
     JSX
     =============================== */
  return (
    <div style={{ marginTop: "24px" }}>
      <h3>Interaktive Zeitreihe</h3>

      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <label>
          Visualisierung:&nbsp;
          <select value={visKey} onChange={(e) => setVisKey(e.target.value)}>
            {VISUALISIERUNGEN.map((v) => (
              <option key={v.key} value={v.key}>
                {v.label}
              </option>
            ))}
          </select>
        </label>

        <span style={{ opacity: 0.7 }}>Tipp: Mit Maus ziehen = Zoom</span>

        {loading && <span>Daten werden geladen…</span>}
        {error && <span style={{ color: "red" }}>{error}</span>}
        {!loading && !error && rows.length > 0 && (
          <span style={{ opacity: 0.7 }}>Messpunkte: {rows.length}</span>
        )}
      </div>

      <div id="vega-timeseries" style={{ marginTop: "12px" }} />
    </div>
  );
}
