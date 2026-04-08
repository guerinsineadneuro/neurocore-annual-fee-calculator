import { useState, useEffect, useMemo } from "react";

const DARK = "#1a1a1a";
const ORANGE = "#f5a623";

const PRICES = {
  "NMS-STR-01": { name: "BASE SaaS Platform Fee", price: 660 },
  "NMS-STR-02": { name: "Edge GW Hosting & Monitoring", price: 545 },
  "NMS-STR-03": { name: "BMS Graphics Hosting & Monitoring", price: 525 },
  "NMS-STR-04": { name: "Cloud to Cloud API Hosting & Monitoring", price: 525 },
  "NMS-STR-05": { name: "Area/Floor Gateway Hosting & Monitoring", price: 295 },
  "NMS-STR-07": { name: "Field Controller +1000 Point Pack Hosting", price: 675 },
  "NMS-STR-08": { name: "Thermostat (Terminal Unit Controller) Hosting", price: 8 },
  "NMS-STR-09": { name: "IoT Device Hosting", price: 8.4 },
  "LTE-ANL": { name: "LTE Cellular Service Fee", price: 720 },
};

const fmt = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Toggle = ({ label, value, onChange }) => (
  <button onClick={() => onChange(!value)} style={{ padding: "8px 20px", borderRadius: 999, fontSize: 13, fontWeight: 600, border: `2px solid ${value ? DARK : "#d1d5db"}`, background: value ? DARK : "white", color: value ? "white" : "#6b7280", cursor: "pointer", transition: "all 0.15s" }}>{label}</button>
);

const ChoiceBtn = ({ label, active, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{ padding: "6px 16px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: `2px solid ${active ? DARK : disabled ? "#e5e7eb" : "#d1d5db"}`, background: active ? DARK : "white", color: active ? "white" : disabled ? "#d1d5db" : "#6b7280", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.15s", opacity: disabled ? 0.5 : 1 }}>{label}</button>
);

const Card = ({ title, children }) => (
  <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: 24, marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ width: 4, height: 22, background: ORANGE, borderRadius: 4 }} />
      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: DARK, letterSpacing: 0.2 }}>{title}</h2>
    </div>
    {children}
  </div>
);

const SectionLabel = ({ label }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginTop: 16, marginBottom: 6 }}>{label}</div>
);

const QtyField = ({ value, onChange, disabled, label, sku, price, min = 0 }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 10, marginBottom: 6, background: disabled ? "#f9fafb" : "#fff8f0", border: `1px solid ${disabled ? "#f3f4f6" : "#fde68a"}`, opacity: disabled ? 0.45 : 1, transition: "all 0.15s" }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10, fontFamily: "monospace", color: "#9ca3af" }}>{sku}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: "#1f2937" }}>{label}</div>
      <div style={{ fontSize: 11, color: DARK, fontWeight: 600 }}>{fmt(price)} / unit / yr</div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 12 }}>
      <button onClick={() => !disabled && onChange(Math.max(min, value - 1))} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #d1d5db", background: "white", cursor: disabled ? "default" : "pointer", fontSize: 16, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
      <input type="number" min={min} value={value} onChange={e => !disabled && onChange(Math.max(min, parseInt(e.target.value) || 0))} disabled={disabled} style={{ width: 52, textAlign: "center", border: "1px solid #d1d5db", borderRadius: 8, padding: "4px 0", fontSize: 13, color: "#111827" }} />
      <button onClick={() => !disabled && onChange(value + 1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #d1d5db", background: "white", cursor: disabled ? "default" : "pointer", fontSize: 16, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
    </div>
    <div style={{ width: 88, textAlign: "right", fontSize: 13, fontWeight: 700, color: disabled ? "#9ca3af" : DARK, marginLeft: 12 }}>{fmt(price * value)}</div>
  </div>
);

const HowToUse = ({ onBack }) => (
  <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "32px 16px", fontFamily: "system-ui, sans-serif" }}>
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: "none", border: `2px solid ${DARK}`, color: DARK, borderRadius: 999, padding: "6px 16px", fontWeight: 600, fontSize: 13, cursor: "pointer", marginBottom: 20 }}>Back to Calculator</button>
        <div style={{ fontSize: 22, fontWeight: 800, color: DARK }}>How to Use the Calculator</div>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>Follow the rules below to correctly configure a project and calculate annual NeuroCore fees.</p>
      </div>

      {[
        {
          title: "Step 1 — Select Project Type",
          items: [
            { label: "GRMS", body: "Guest Room Management System. Select this if the project involves guest room controls. Triggers thermostats. Requires choosing an integration type: API or On-Prem Server.\n\nAPI examples: Interel, Verdant, Lutron, H2O Connected, Symmons.\nOn-Prem Server examples: Telkonet, Inncom." },
            { label: "BMS Lite", body: "Building Management System Lite. Select this if the project involves IoT sensor monitoring. Triggers a LoRaWAN Gateway requirement, Thermostat hosting, and IoT Device hosting." },
            { label: "BMS Overlay", body: "Building Management System Overlay. Select this if the project involves BMS graphics and point pack integration. Triggers BMS Graphics Hosting, Point Packs, and requires a NeuroEdge Gateway R2." },
          ]
        },
        {
          title: "Step 2 — NeuroEdge Gateway Rules",
          items: [
            { label: "When is a NeuroEdge Gateway required?", body: "A NeuroEdge Gateway is required when GRMS On-Prem is selected, or when BMS Overlay is selected." },
            { label: "Which model is needed?", body: "If the project has BMS Overlay (with or without GRMS), the NeuroEdge Gateway R2 is required. If the project has GRMS On-Prem only (no BMS Overlay), the NeuroEdge Gateway P1/R1 can be used." },
            { label: "Shared gateway", body: "If a project has both GRMS On-Prem and BMS Overlay, they share one gateway. The R2 is always used in this case." },
            { label: "Connectivity and Modem", body: "The NeuroEdge Gateway can be Internet Only or Cellular. If the NeuroEdge Gateway is selected, a cellular modem must be included in the hardware quote. The modem can be used in place of cellular connectivity through the gateway itself if preferred." },
          ]
        },
        {
          title: "Step 3 — LoRaWAN Gateway Rules",
          items: [
            { label: "When is a LoRaWAN Gateway required?", body: "A LoRaWAN Gateway is required when BMS Lite is selected. The number of LoRaWAN Gateways on the project sets the minimum number of Area/Floor Gateway Hosting fees." },
            { label: "Connectivity — Internet Only", body: "The LoRaWAN Gateway can always be set to Internet Only. If the customer wants cellular capability, they can optionally add a standalone modem. The modem can be used in place of cellular through the gateway." },
            { label: "Connectivity — Cellular", body: "The LoRaWAN Gateway can only be set to Cellular if there is NO NeuroEdge Gateway on the project. If a NeuroEdge Gateway is present, the LoRaWAN must be Internet Only. No modem is needed when LoRaWAN Cellular is selected." },
          ]
        },
        {
          title: "Step 4 — LTE and Cellular Rules",
          items: [
            { label: "When does the LTE fee apply?", body: "The LTE Cellular Service Fee ($720/yr) applies in any of these scenarios: NeuroEdge Gateway is set to Cellular, LoRaWAN Gateway is set to Cellular, or LoRaWAN Gateway is Internet Only with a modem added." },
            { label: "How many LTE fees?", body: "There is always only one LTE fee per project, regardless of how many devices use cellular." },
          ]
        },
        {
          title: "Annual Fee Reference",
          items: [
            { label: "BASE SaaS Platform Fee", body: "Always included on every project. Minimum quantity of 1, cannot be removed." },
            { label: "Edge GW Hosting and Monitoring", body: "Automatically enabled when a NeuroEdge Gateway is on the project (GRMS On-Prem or BMS Overlay)." },
            { label: "Area/Floor Gateway Hosting", body: "Automatically enabled when a LoRaWAN Gateway is on the project (BMS Lite). The minimum quantity matches the number of LoRaWAN Gateways selected." },
            { label: "BMS Graphics Hosting", body: "Automatically enabled when BMS Overlay is selected." },
            { label: "Cloud to Cloud API Hosting", body: "Available on any project. Does not require GRMS to be selected. Examples: Interel, Verdant, Lutron, H2O Connected, Symmons. If GRMS with API integration is selected, this fee cannot go below 1." },
            { label: "Field Controller Point Pack Hosting", body: "Automatically enabled when BMS Overlay is selected. Defaults to 5 packs but is editable." },
            { label: "Thermostat Hosting", body: "Available when GRMS or BMS Lite is selected. Enter the number of thermostats on the project." },
            { label: "IoT Device Hosting", body: "Available when BMS Lite is selected. Enter the number of IoT devices on the project." },
            { label: "LTE Cellular Service Fee", body: "Automatically enabled when any cellular connectivity is in use. Always one fee per project, minimum of 1." },
          ]
        },
      ].map(section => (
        <div key={section.title} style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: 24, marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 4, height: 22, background: ORANGE, borderRadius: 4 }} />
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: DARK }}>{section.title}</h2>
          </div>
          {section.items.map(item => (
            <div key={item.label} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.6, whiteSpace: "pre-line" }}>{item.body}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default function App() {
  const [view, setView] = useState("calculator");
  const [grms, setGrms] = useState(false);
  const [bmsLite, setBmsLite] = useState(false);
  const [bmsOverlay, setBmsOverlay] = useState(false);
  const [grmsIntegration, setGrmsIntegration] = useState("");
  const [negConnectivity, setNegConnectivity] = useState("internet");
  const [loraConnectivity, setLoraConnectivity] = useState("internet");
  const [loraModem, setLoraModem] = useState(false);
  const [loraQty, setLoraQty] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [copied, setCopied] = useState(false);

  const [qty, setQty] = useState({
    "NMS-STR-01": 1, "NMS-STR-02": 0, "NMS-STR-03": 0, "NMS-STR-04": 0,
    "NMS-STR-05": 0, "NMS-STR-07": 5, "NMS-STR-08": 0, "NMS-STR-09": 0,
    "LTE-ANL": 0,
  });

  const hasNEG = (grms && grmsIntegration === "onprem") || bmsOverlay;
  const hasLoRa = bmsLite;
  const negModel = bmsOverlay ? "R2" : (grms && grmsIntegration === "onprem") ? "P1/R1" : "";
  const loraCanBeCellular = !hasNEG;
  const hasCellular = (hasNEG && negConnectivity === "cellular") || (hasLoRa && loraConnectivity === "cellular") || (hasLoRa && loraConnectivity === "internet" && loraModem);
  const apiMin = (grms && grmsIntegration === "api") ? 1 : 0;

  useEffect(() => { if (hasNEG) setLoraConnectivity("internet"); }, [hasNEG]);
  useEffect(() => { if (!hasLoRa) { setLoraModem(false); setLoraQty(1); } }, [hasLoRa]);
  useEffect(() => { if (loraConnectivity === "cellular") setLoraModem(false); }, [loraConnectivity]);

  useEffect(() => {
    setQty(prev => ({
      ...prev,
      "NMS-STR-02": hasNEG ? Math.max(prev["NMS-STR-02"] || 1, 1) : 0,
      "NMS-STR-03": bmsOverlay ? Math.max(prev["NMS-STR-03"] || 1, 1) : 0,
      "NMS-STR-04": (grms && grmsIntegration === "api") ? Math.max(prev["NMS-STR-04"] || 1, 1) : prev["NMS-STR-04"],
      "NMS-STR-05": hasLoRa ? Math.max(prev["NMS-STR-05"] || loraQty, loraQty) : 0,
      "NMS-STR-07": bmsOverlay ? (prev["NMS-STR-07"] || 5) : 0,
      "NMS-STR-08": (grms || bmsLite) ? prev["NMS-STR-08"] : 0,
      "NMS-STR-09": bmsLite ? prev["NMS-STR-09"] : 0,
      "LTE-ANL": hasCellular ? Math.max(prev["LTE-ANL"] || 1, 1) : 0,
    }));
  }, [grms, bmsLite, bmsOverlay, grmsIntegration, hasNEG, hasLoRa, hasCellular, loraQty]);

  const setQ = (sku, val, min = 0) => setQty(prev => ({ ...prev, [sku]: Math.max(min, val) }));

  const lineItems = useMemo(() =>
    Object.entries(PRICES).map(([sku, { name, price }]) => ({
      sku, name, price, qty: qty[sku] || 0, subtotal: price * (qty[sku] || 0),
    })), [qty]);

  const activeItems = lineItems.filter(i => i.subtotal > 0);
  const total = lineItems.reduce((s, i) => s + i.subtotal, 0);
  const projectTypes = [grms && `GRMS (${grmsIntegration === "api" ? "API" : grmsIntegration === "onprem" ? "On-Prem" : "?"})`, bmsLite && "BMS Lite", bmsOverlay && "BMS Overlay"].filter(Boolean).join(", ") || "None selected";

  const buildSummaryText = () => [
    "SMARTCON — NeuroCore Annual Fee Summary",
    "========================================",
    projectName ? `Project: ${projectName}` : "",
    `Configuration: ${projectTypes}`,
    "", "LINE ITEMS", "----------",
    ...activeItems.map(i => `${i.name} x${i.qty}  ${fmt(i.subtotal)}`),
    "", `TOTAL ANNUAL FEES: ${fmt(total)}`, "",
    `Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
  ].filter(Boolean).join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(buildSummaryText()).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  const handlePrint = () => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>NeuroCore Annual Fee Summary${projectName ? " - " + projectName : ""}</title>
    <style>* { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: system-ui, sans-serif; color: #1f2937; padding: 40px; max-width: 720px; margin: 0 auto; } .header { border-bottom: 3px solid ${ORANGE}; padding-bottom: 16px; margin-bottom: 24px; } .brand { font-size: 11px; font-weight: 700; color: ${ORANGE}; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; } h1 { font-size: 22px; font-weight: 800; color: ${DARK}; } .meta { font-size: 13px; color: #6b7280; margin-top: 4px; } .config { background: #fff8f0; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; font-size: 13px; } .config strong { color: ${DARK}; } table { width: 100%; border-collapse: collapse; margin-bottom: 24px; } thead tr { background: ${DARK}; color: white; } th { padding: 10px 14px; font-size: 12px; text-align: left; font-weight: 600; } td { padding: 9px 14px; font-size: 13px; border-bottom: 1px solid #f3f4f6; } tr:nth-child(even) td { background: #f9fafb; } .sku { font-family: monospace; font-size: 11px; color: #9ca3af; } .amount { text-align: right; font-weight: 600; } .total-row { background: ${DARK} !important; } .total-row td { color: white; font-weight: 700; font-size: 15px; border: none; padding: 12px 14px; } .total-amt { color: ${ORANGE} !important; text-align: right; font-size: 18px !important; } .footer { font-size: 11px; color: #9ca3af; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 12px; }</style></head><body>
    <div class="header"><div class="brand">Smartcon</div><h1>NeuroCore Annual Fee Summary</h1>${projectName ? `<div class="meta">Project: ${projectName}</div>` : ""}<div class="meta">Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div></div>
    <div class="config"><strong>Configuration:</strong> ${projectTypes}</div>
    <table><thead><tr><th>SKU</th><th>Description</th><th style="text-align:right">Qty</th><th style="text-align:right">Unit Price</th><th style="text-align:right">Subtotal</th></tr></thead><tbody>
    ${activeItems.map(i => `<tr><td class="sku">${i.sku}</td><td>${i.name}</td><td class="amount">${i.qty}</td><td class="amount">${fmt(i.price)}</td><td class="amount">${fmt(i.subtotal)}</td></tr>`).join("")}
    <tr class="total-row"><td colspan="4">Total Annual Fees</td><td class="total-amt amount">${fmt(total)}</td></tr></tbody></table>
    <div class="footer">This summary was generated using the Smartcon NeuroCore Annual Fee Calculator. Prices are subject to change.</div></body></html>`);
    w.document.close(); w.focus(); w.print();
  };

  if (view === "guide") return <HowToUse onBack={() => setView("calculator")} />;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "32px 16px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: DARK }}>NeuroCore Annual Fee Calculator</div>
          </div>
          <button onClick={() => setView("guide")} style={{ marginTop: 6, background: "none", border: `2px solid ${DARK}`, color: DARK, borderRadius: 999, padding: "6px 16px", fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>How to Use</button>
        </div>

        <Card title="Project Type">
          <p style={{ margin: "0 0 14px", fontSize: 13, color: "#6b7280" }}>Select all that apply to this project.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Toggle label="GRMS" value={grms} onChange={v => { setGrms(v); if (!v) setGrmsIntegration(""); }} />
            <Toggle label="BMS Lite" value={bmsLite} onChange={setBmsLite} />
            <Toggle label="BMS Overlay" value={bmsOverlay} onChange={setBmsOverlay} />
          </div>
          {grms && (
            <div style={{ marginTop: 16, padding: "14px 16px", background: "#fff8f0", borderRadius: 12, border: "1px solid #fde68a" }}>
              <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: DARK }}>GRMS Integration Type</p>
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
                  <span style={{ fontSize: 12, fontWeight: 700, color: DARK, background: "#fff8f0", border: `1px solid ${ORANGE}`, borderRadius: 999, padding: "4px 12px" }}>
                    {negModel === "R2" ? "NeuroEdge Gateway R2" : "NeuroEdge Gateway P1/R1"}
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>Connectivity</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <ChoiceBtn label="Internet Only" active={negConnectivity === "internet"} onClick={() => setNegConnectivity("internet")} />
                  <ChoiceBtn label="Cellular" active={negConnectivity === "cellular"} onClick={() => setNegConnectivity("cellular")} />
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: "#b45309", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "6px 10px" }}>
                  {negConnectivity === "cellular"
                    ? "Include a NeuroEdge Gateway P1/R1 and a cellular modem in the hardware quote for this project."
                    : "Include a NeuroEdge Gateway P1/R1 in the hardware quote for this project."}
                </div>
              </div>
            )}

            {hasLoRa && (
              <div style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", marginBottom: 8 }}>LoRaWAN Gateway (915 MHz)</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>Number of Gateways</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <button onClick={() => setLoraQty(q => Math.max(1, q - 1))} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #d1d5db", background: "white", cursor: "pointer", fontSize: 16, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                  <input type="number" min={1} value={loraQty} onChange={e => setLoraQty(Math.max(1, parseInt(e.target.value) || 1))} style={{ width: 52, textAlign: "center", border: "1px solid #d1d5db", borderRadius: 8, padding: "4px 0", fontSize: 13 }} />
                  <button onClick={() => setLoraQty(q => q + 1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #d1d5db", background: "white", cursor: "pointer", fontSize: 16, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 4 }}>Sets minimum Area/Floor GW hosting fees</span>
                </div>

                {!loraCanBeCellular && (
                  <div style={{ fontSize: 11, color: "#b45309", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "4px 10px", marginBottom: 8, display: "inline-block" }}>
                    Cellular unavailable — NeuroEdge Gateway is handling cellular on this project
                  </div>
                )}
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>Connectivity</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <ChoiceBtn label="Internet Only" active={loraConnectivity === "internet"} onClick={() => setLoraConnectivity("internet")} />
                  <ChoiceBtn label="Cellular" active={loraConnectivity === "cellular"} onClick={() => loraCanBeCellular && setLoraConnectivity("cellular")} disabled={!loraCanBeCellular} />
                </div>

                {loraConnectivity === "internet" && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>Optional: Add Cellular Modem</div>
                    <ChoiceBtn label={loraModem ? "Modem Added" : "Add Modem"} active={loraModem} onClick={() => setLoraModem(!loraModem)} />
                    {loraModem && (
                      <div style={{ marginTop: 10, fontSize: 12, color: "#b45309", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "6px 10px" }}>
                        Include a cellular modem in the hardware quote. The modem can be used in place of cellular connectivity through the gateway.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        <Card title="Annual License Fees">
          <SectionLabel label="Platform" />
          <QtyField sku="NMS-STR-01" label={PRICES["NMS-STR-01"].name} price={PRICES["NMS-STR-01"].price} value={qty["NMS-STR-01"]} onChange={v => setQ("NMS-STR-01", v, 1)} disabled={false} min={1} />

          <SectionLabel label="Gateway Hosting" />
          <QtyField sku="NMS-STR-02" label={PRICES["NMS-STR-02"].name} price={PRICES["NMS-STR-02"].price} value={qty["NMS-STR-02"]} onChange={v => setQ("NMS-STR-02", v)} disabled={!hasNEG} />
          <QtyField sku="NMS-STR-05" label={PRICES["NMS-STR-05"].name} price={PRICES["NMS-STR-05"].price} value={qty["NMS-STR-05"]} onChange={v => setQ("NMS-STR-05", v, hasLoRa ? loraQty : 0)} disabled={!hasLoRa} min={hasLoRa ? loraQty : 0} />

          <SectionLabel label="Integrations & Services" />
          <QtyField sku="NMS-STR-03" label={PRICES["NMS-STR-03"].name} price={PRICES["NMS-STR-03"].price} value={qty["NMS-STR-03"]} onChange={v => setQ("NMS-STR-03", v)} disabled={!bmsOverlay} />
          <QtyField sku="NMS-STR-07" label={PRICES["NMS-STR-07"].name} price={PRICES["NMS-STR-07"].price} value={qty["NMS-STR-07"]} onChange={v => setQ("NMS-STR-07", v)} disabled={!bmsOverlay} />
          <QtyField sku="NMS-STR-04" label={PRICES["NMS-STR-04"].name} price={PRICES["NMS-STR-04"].price} value={qty["NMS-STR-04"]} onChange={v => setQ("NMS-STR-04", v, apiMin)} disabled={false} min={apiMin} />

          <SectionLabel label="Connectivity" />
          <QtyField sku="LTE-ANL" label={PRICES["LTE-ANL"].name} price={PRICES["LTE-ANL"].price} value={qty["LTE-ANL"]} onChange={v => setQ("LTE-ANL", v, hasCellular ? 1 : 0)} disabled={!hasCellular} min={hasCellular ? 1 : 0} />

          <SectionLabel label="Devices" />
          <QtyField sku="NMS-STR-08" label={PRICES["NMS-STR-08"].name} price={PRICES["NMS-STR-08"].price} value={qty["NMS-STR-08"]} onChange={v => setQ("NMS-STR-08", v)} disabled={!(grms || bmsLite)} />
          <QtyField sku="NMS-STR-09" label={PRICES["NMS-STR-09"].name} price={PRICES["NMS-STR-09"].price} value={qty["NMS-STR-09"]} onChange={v => setQ("NMS-STR-09", v)} disabled={!bmsLite} />

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "2px solid #e5e7eb" }}>
            {activeItems.map(i => (
              <div key={i.sku} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#4b5563", marginBottom: 4 }}>
                <span>{i.name} <span style={{ color: "#9ca3af" }}>x{i.qty}</span></span>
                <span style={{ fontWeight: 600 }}>{fmt(i.subtotal)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: DARK, color: "white", borderRadius: 12, padding: "14px 20px", marginTop: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Total Annual Fees</span>
              <span style={{ fontWeight: 800, fontSize: 24, color: ORANGE }}>{fmt(total)}</span>
            </div>
          </div>
        </Card>

        <Card title="Export Summary">
          <p style={{ margin: "0 0 14px", fontSize: 13, color: "#6b7280" }}>Optionally add a project name before exporting.</p>
          <input type="text" placeholder="Project name (optional)" value={projectName} onChange={e => setProjectName(e.target.value)}
            style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#111827", marginBottom: 14, outline: "none" }} />
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handlePrint} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: `2px solid ${DARK}`, background: DARK, color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              🖨️ Print / Save as PDF
            </button>
            <button onClick={handleCopy} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: `2px solid ${copied ? "#16a34a" : ORANGE}`, background: copied ? "#16a34a" : ORANGE, color: copied ? "white" : DARK, fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
              {copied ? "Copied!" : "📋 Copy Summary"}
            </button>
          </div>
        </Card>

      </div>
    </div>
  );
}
