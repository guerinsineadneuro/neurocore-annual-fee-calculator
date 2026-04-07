import { useState, useEffect, useMemo, useRef } from "react";

const TEAL = "#1a6b6e";
const LIME = "#c8d42a";

const PRICES = {
  "NMS-STR-01": { name: "BASE SaaS Platform Fee", price: 660 },
  "NMS-STR-02": { name: "Edge GW Hosting & Monitoring", price: 545 },
  "NMS-STR-03": { name: "BMS Graphics Hosting & Monitoring", price: 525 },
  "NMS-STR-04": { name: "Cloud to Cloud API Hosting & Monitoring", price: 525 },
  "NMS-STR-05": { name: "Area/Floor Gateway Hosting & Monitoring", price: 295 },
  "NMS-STR-07": { name: "Field Controller +1000 Point Pack Hosting", price: 675 },
  "NMS-STR-08": { name: "Thermostat (Terminal Unit Controller) Hosting", price: 8 },
  "NMS-STR-09": { name: "IoT Device Hosting", price: 8.4 },
};

const fmt = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Toggle = ({ label, value, onChange }) => (
  <button onClick={() => onChange(!value)} style={{ padding: "8px 20px", borderRadius: 999, fontSize: 13, fontWeight: 600, border: `2px solid ${value ? TEAL : "#d1d5db"}`, background: value ? TEAL : "white", color: value ? "white" : "#6b7280", cursor: "pointer", transition: "all 0.15s" }}>{label}</button>
);

const ChoiceBtn = ({ label, active, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{ padding: "6px 16px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: `2px solid ${active ? TEAL : disabled ? "#e5e7eb" : "#d1d5db"}`, background: active ? TEAL : "white", color: active ? "white" : disabled ? "#d1d5db" : "#6b7280", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.15s", opacity: disabled ? 0.5 : 1 }}>{label}</button>
);

const Card = ({ title, children }) => (
  <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: 24, marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ width: 4, height: 22, background: LIME, borderRadius: 4 }} />
      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEAL, letterSpacing: 0.2 }}>{title}</h2>
    </div>
    {children}
  </div>
);

const SectionLabel = ({ label }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginTop: 16, marginBottom: 6 }}>{label}</div>
);

const QtyField = ({ value, onChange, disabled, label, sku, price }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 10, marginBottom: 6, background: disabled ? "#f9fafb" : "#f0fdf8", border: `1px solid ${disabled ? "#f3f4f6" : "#d1fae5"}`, opacity: disabled ? 0.45 : 1, transition: "all 0.15s" }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10, fontFamily: "monospace", color: "#9ca3af" }}>{sku}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: "#1f2937" }}>{label}</div>
      <div style={{ fontSize: 11, color: TEAL, fontWeight: 600 }}>{fmt(price)} / unit / yr</div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 12 }}>
      <button onClick={() => !disabled && onChange(Math.max(0, value - 1))} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #d1d5db", background: "white", cursor: disabled ? "default" : "pointer", fontSize: 16, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
      <input type="number" min={0} value={value} onChange={e => !disabled && onChange(Math.max(0, parseInt(e.target.value) || 0))} disabled={disabled} style={{ width: 52, textAlign: "center", border: "1px solid #d1d5db", borderRadius: 8, padding: "4px 0", fontSize: 13, color: "#111827" }} />
      <button onClick={() => !disabled && onChange(value + 1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #d1d5db", background: "white", cursor: disabled ? "default" : "pointer", fontSize: 16, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
    </div>
    <div style={{ width: 88, textAlign: "right", fontSize: 13, fontWeight: 700, color: disabled ? "#9ca3af" : TEAL, marginLeft: 12 }}>{fmt(price * value)}</div>
  </div>
);

export default function App() {
  const [grms, setGrms] = useState(false);
  const [bmsLite, setBmsLite] = useState(false);
  const [bmsOverlay, setBmsOverlay] = useState(false);
  const [grmsIntegration, setGrmsIntegration] = useState("");
  const [negConnectivity, setNegConnectivity] = useState("internet");
  const [loraConnectivity, setLoraConnectivity] = useState("internet");
  const [projectName, setProjectName] = useState("");
  const [copied, setCopied] = useState(false);

  const [qty, setQty] = useState({
    "NMS-STR-01": 1, "NMS-STR-02": 0, "NMS-STR-03": 0, "NMS-STR-04": 0,
    "NMS-STR-05": 0, "NMS-STR-07": 5, "NMS-STR-08": 0, "NMS-STR-09": 0,
  });

  const hasNEG = (grms && grmsIntegration === "onprem") || bmsOverlay;
  const hasLoRa = bmsLite;
  const negModel = bmsOverlay ? "0310" : (grms && grmsIntegration === "onprem") ? "0115" : "";
  const loraCanBeCellular = !hasNEG;

  useEffect(() => { if (hasNEG) setLoraConnectivity("internet"); }, [hasNEG]);

  useEffect(() => {
    setQty(prev => ({
      ...prev,
      "NMS-STR-02": hasNEG ? Math.max(prev["NMS-STR-02"] || 1, 1) : 0,
      "NMS-STR-03": bmsOverlay ? Math.max(prev["NMS-STR-03"] || 1, 1) : 0,
      "NMS-STR-04": (grms && grmsIntegration === "api") ? Math.max(prev["NMS-STR-04"] || 1, 1) : 0,
      "NMS-STR-05": hasLoRa ? Math.max(prev["NMS-STR-05"] || 1, 1) : 0,
      "NMS-STR-07": bmsOverlay ? (prev["NMS-STR-07"] || 5) : 0,
      "NMS-STR-08": (grms || bmsLite) ? prev["NMS-STR-08"] : 0,
      "NMS-STR-09": bmsLite ? prev["NMS-STR-09"] : 0,
    }));
  }, [grms, bmsLite, bmsOverlay, grmsIntegration, hasNEG, hasLoRa]);

  const setQ = (sku, val) => setQty(prev => ({ ...prev, [sku]: val }));

  const lineItems = useMemo(() =>
    Object.entries(PRICES).map(([sku, { name, price }]) => ({
      sku, name, price, qty: qty[sku] || 0, subtotal: price * (qty[sku] || 0),
    })), [qty]);

  const activeItems = lineItems.filter(i => i.subtotal > 0);
  const total = lineItems.reduce((s, i) => s + i.subtotal, 0);

  const projectTypes = [grms && `GRMS (${grmsIntegration === "api" ? "API" : grmsIntegration === "onprem" ? "On-Prem" : "—"})`, bmsLite && "BMS Lite", bmsOverlay && "BMS Overlay"].filter(Boolean).join(", ") || "None selected";

  const buildSummaryText = () => {
    const lines = [
      "SMARTCON — NeuroCore Annual Fee Summary",
      "========================================",
      projectName ? `Project: ${projectName}` : "",
      `Configuration: ${projectTypes}`,
      "",
      "LINE ITEMS",
      "----------",
      ...activeItems.map(i => `${i.name} ×${i.qty}  ${fmt(i.subtotal)}`),
      "",
      `TOTAL ANNUAL FEES: ${fmt(total)}`,
      "",
      `Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    ];
    return lines.filter(Boolean).join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildSummaryText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    const w = window.open("", "_blank");
    w.document.write(`
      <html><head><title>NeuroCore Annual Fee Summary${projectName ? " – " + projectName : ""}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, sans-serif; color: #1f2937; padding: 40px; max-width: 720px; margin: 0 auto; }
        .header { border-bottom: 3px solid #c8d42a; padding-bottom: 16px; margin-bottom: 24px; }
        .brand { font-size: 11px; font-weight: 700; color: #c8d42a; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
        h1 { font-size: 22px; font-weight: 800; color: #1a6b6e; }
        .meta { font-size: 13px; color: #6b7280; margin-top: 4px; }
        .config { background: #f0fdf8; border: 1px solid #d1fae5; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; font-size: 13px; }
        .config strong { color: #1a6b6e; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        thead tr { background: #1a6b6e; color: white; }
        th { padding: 10px 14px; font-size: 12px; text-align: left; font-weight: 600; }
        td { padding: 9px 14px; font-size: 13px; border-bottom: 1px solid #f3f4f6; }
        tr:nth-child(even) td { background: #f9fafb; }
        .sku { font-family: monospace; font-size: 11px; color: #9ca3af; }
        .amount { text-align: right; font-weight: 600; }
        .total-row { background: #1a6b6e !important; }
        .total-row td { color: white; font-weight: 700; font-size: 15px; border: none; padding: 12px 14px; }
        .total-amt { color: #c8d42a !important; text-align: right; font-size: 18px !important; }
        .footer { font-size: 11px; color: #9ca3af; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 12px; }
      </style></head><body>
      <div class="header">
        <div class="brand">Smartcon</div>
        <h1>NeuroCore Annual Fee Summary</h1>
        ${projectName ? `<div class="meta">Project: ${projectName}</div>` : ""}
        <div class="meta">Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
      </div>
      <div class="config"><strong>Configuration:</strong> ${projectTypes}</div>
      <table>
        <thead><tr><th>SKU</th><th>Description</th><th style="text-align:right">Qty</th><th style="text-align:right">Unit Price</th><th style="text-align:right">Subtotal</th></tr></thead>
        <tbody>
          ${activeItems.map(i => `<tr><td class="sku">${i.sku}</td><td>${i.name}</td><td class="amount">${i.qty}</td><td class="amount">${fmt(i.price)}</td><td class="amount">${fmt(i.subtotal)}</td></tr>`).join("")}
          <tr class="total-row"><td colspan="4">Total Annual Fees</td><td class="total-amt amount">${fmt(total)}</td></tr>
        </tbody>
      </table>
      <div class="footer">This summary was generated using the Smartcon NeuroCore Annual Fee Calculator. Prices are subject to change.</div>
      </body></html>
    `);
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "32px 16px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: LIME, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Smartcon</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: TEAL }}>NeuroCore Annual Fee Calculator</div>
        </div>

        <Card title="Project Type">
          <p style={{ margin: "0 0 14px", fontSize: 13, color: "#6b7280" }}>Select all that apply to this project.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Toggle label="GRMS" value={grms} onChange={v => { setGrms(v); if (!v) setGrmsIntegration(""); }} />
            <Toggle label="BMS Lite" value={bmsLite} onChange={setBmsLite} />
            <Toggle label="BMS Overlay" value={bmsOverlay} onChange={setBmsOverlay} />
          </div>
          {grms && (
            <div style={{ marginTop: 16, padding: "14px 16px", background: "#f0fdf8", borderRadius: 12, border: "1px solid #d1fae5" }}>
              <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: TEAL }}>GRMS Integration Type</p>
              <div style={{ display: "flex", gap: 8 }}>
                <ChoiceBtn label="API" active={grmsIntegration === "api"} onClick={() => setGrmsIntegration("api")} />
                <ChoiceBtn label="On-Prem Server" active={grmsIntegration === "onprem"} onClick={() => setGrmsIntegration("onprem")} />
              </div>
            </div>
          )}
        </Card>

        {(hasNEG || hasLoRa) && (
          <Card title="Hardware Configuration">
            <p style={{ margin: "0 0 14px", fontSize: 13, color: "#6b7280" }}>Hardware costs are not included in annual fee totals.</p>
            {hasNEG && (
              <div style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1f2937" }}>NeuroEdge Gateway</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>Model auto-selected based on project type</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEAL, background: "#f0fdf8", border: `1px solid ${LIME}`, borderRadius: 999, padding: "4px 12px" }}>
                    {negModel === "0310" ? "0310 – Rack Mountable" : "0115 – Mini"}
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>Connectivity</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <ChoiceBtn label="Internet Only" active={negConnectivity === "internet"} onClick={() => setNegConnectivity("internet")} />
                  <ChoiceBtn label="Cellular" active={negConnectivity === "cellular"} onClick={() => setNegConnectivity("cellular")} />
                </div>
              </div>
            )}
            {hasLoRa && (
              <div style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", marginBottom: 2 }}>LoRaWAN Gateway (915 MHz)</div>
                {!loraCanBeCellular && (
                  <div style={{ fontSize: 11, color: "#b45309", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "4px 10px", margin: "6px 0 8px", display: "inline-block" }}>
                    ⚠ Cellular unavailable — NeuroEdge is handling cellular on this project
                  </div>
                )}
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", margin: "8px 0 6px" }}>Connectivity</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <ChoiceBtn label="Internet Only" active={loraConnectivity === "internet"} onClick={() => setLoraConnectivity("internet")} />
                  <ChoiceBtn label="Cellular" active={loraConnectivity === "cellular"} onClick={() => loraCanBeCellular && setLoraConnectivity("cellular")} disabled={!loraCanBeCellular} />
                </div>
              </div>
            )}
          </Card>
        )}

        <Card title="Annual License Fees">
          <SectionLabel label="Platform" />
          <QtyField sku="NMS-STR-01" label={PRICES["NMS-STR-01"].name} price={PRICES["NMS-STR-01"].price} value={qty["NMS-STR-01"]} onChange={v => setQ("NMS-STR-01", v)} disabled={false} />
          <SectionLabel label="Gateway Hosting" />
          <QtyField sku="NMS-STR-02" label={PRICES["NMS-STR-02"].name} price={PRICES["NMS-STR-02"].price} value={qty["NMS-STR-02"]} onChange={v => setQ("NMS-STR-02", v)} disabled={!hasNEG} />
          <QtyField sku="NMS-STR-05" label={PRICES["NMS-STR-05"].name} price={PRICES["NMS-STR-05"].price} value={qty["NMS-STR-05"]} onChange={v => setQ("NMS-STR-05", v)} disabled={!hasLoRa} />
          <SectionLabel label="Integrations & Services" />
          <QtyField sku="NMS-STR-03" label={PRICES["NMS-STR-03"].name} price={PRICES["NMS-STR-03"].price} value={qty["NMS-STR-03"]} onChange={v => setQ("NMS-STR-03", v)} disabled={!bmsOverlay} />
          <QtyField sku="NMS-STR-04" label={PRICES["NMS-STR-04"].name} price={PRICES["NMS-STR-04"].price} value={qty["NMS-STR-04"]} onChange={v => setQ("NMS-STR-04", v)} disabled={!(grms && grmsIntegration === "api")} />
          <QtyField sku="NMS-STR-07" label={PRICES["NMS-STR-07"].name} price={PRICES["NMS-STR-07"].price} value={qty["NMS-STR-07"]} onChange={v => setQ("NMS-STR-07", v)} disabled={!bmsOverlay} />
          <SectionLabel label="Devices" />
          <QtyField sku="NMS-STR-08" label={PRICES["NMS-STR-08"].name} price={PRICES["NMS-STR-08"].price} value={qty["NMS-STR-08"]} onChange={v => setQ("NMS-STR-08", v)} disabled={!(grms || bmsLite)} />
          <QtyField sku="NMS-STR-09" label={PRICES["NMS-STR-09"].name} price={PRICES["NMS-STR-09"].price} value={qty["NMS-STR-09"]} onChange={v => setQ("NMS-STR-09", v)} disabled={!bmsLite} />

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "2px solid #e5e7eb" }}>
            {activeItems.map(i => (
              <div key={i.sku} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#4b5563", marginBottom: 4 }}>
                <span>{i.name} <span style={{ color: "#9ca3af" }}>×{i.qty}</span></span>
                <span style={{ fontWeight: 600 }}>{fmt(i.subtotal)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: TEAL, color: "white", borderRadius: 12, padding: "14px 20px", marginTop: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Total Annual Fees</span>
              <span style={{ fontWeight: 800, fontSize: 24, color: LIME }}>{fmt(total)}</span>
            </div>
          </div>
        </Card>

        <Card title="Export Summary">
          <p style={{ margin: "0 0 14px", fontSize: 13, color: "#6b7280" }}>Optionally add a project name before exporting.</p>
          <input
            type="text"
            placeholder="Project name (optional)"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#111827", marginBottom: 14, outline: "none" }}
          />
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handlePrint} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: `2px solid ${TEAL}`, background: TEAL, color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              🖨️ Print / Save as PDF
            </button>
            <button onClick={handleCopy} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: `2px solid ${copied ? "#16a34a" : LIME}`, background: copied ? "#16a34a" : LIME, color: copied ? "white" : "#1f2937", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
              {copied ? "✓ Copied!" : "📋 Copy Summary"}
            </button>
          </div>
        </Card>

      </div>
    </div>
  );
}
