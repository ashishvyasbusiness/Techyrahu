import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0a0a08",
  surface: "#111110",
  surfaceHigh: "#1a1a18",
  border: "#2a2a26",
  amber: "#f59e0b",
  amberDim: "#92400e",
  green: "#22c55e",
  red: "#ef4444",
  blue: "#3b82f6",
  text: "#e8e6df",
  textMuted: "#7a7870",
  textDim: "#4a4a46",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${COLORS.bg}; color: ${COLORS.text}; font-family: 'IBM Plex Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${COLORS.surface}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.amberDim}; border-radius: 2px; }

  @keyframes pulse-amber {
    0%, 100% { opacity: 1; box-shadow: 0 0 8px ${COLORS.amber}; }
    50% { opacity: 0.6; box-shadow: 0 0 2px ${COLORS.amber}; }
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes slide-up { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes flow-in { from { opacity:0; transform:translateX(-10px); } to { opacity:1; transform:translateX(0); } }
  @keyframes scan { 0%{top:0} 100%{top:100%} }
  @keyframes grid-move { from{background-position:0 0} to{background-position:40px 40px} }
  @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  .nav-link { color: ${COLORS.textMuted}; text-decoration: none; font-size: 13px; letter-spacing: 0.08em; font-weight: 500; text-transform: uppercase; transition: color 0.2s; cursor: pointer; }
  .nav-link:hover, .nav-link.active { color: ${COLORS.amber}; }

  .btn-primary {
    background: ${COLORS.amber};
    color: #000;
    border: none;
    padding: 12px 28px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  }
  .btn-primary:hover { background: #fbbf24; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(245,158,11,0.3); }

  .btn-ghost {
    background: transparent;
    color: ${COLORS.textMuted};
    border: 1px solid ${COLORS.border};
    padding: 11px 24px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: ${COLORS.amber}; color: ${COLORS.amber}; }

  .card {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    position: relative;
    overflow: hidden;
  }
  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${COLORS.amber}40, transparent);
  }

  .mono { font-family: 'IBM Plex Mono', monospace; }
  .bebas { font-family: 'Bebas Neue', cursive; }

  .stat-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: ${COLORS.amberDim}22;
    border: 1px solid ${COLORS.amberDim};
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: ${COLORS.amber};
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .tag {
    padding: 3px 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: 1px solid;
  }

  .grid-bg {
    background-image: linear-gradient(${COLORS.border}44 1px, transparent 1px),
      linear-gradient(90deg, ${COLORS.border}44 1px, transparent 1px);
    background-size: 40px 40px;
    animation: grid-move 8s linear infinite;
  }

  .whatsapp-msg {
    animation: slide-up 0.3s ease forwards;
  }

  .arch-node {
    transition: all 0.3s;
  }
  .arch-node:hover {
    filter: drop-shadow(0 0 12px ${COLORS.amber}88);
  }
`;

// ─── DATA ───────────────────────────────────────────────────────────────────

const inventory = [
  { sku: "WH-001", name: "Industrial Bolts M12", qty: 4820, min: 500, unit: "pcs", location: "A-12", status: "ok" },
  { sku: "WH-002", name: "Steel Pipe 2in", qty: 142, min: 200, unit: "m", location: "B-03", status: "low" },
  { sku: "WH-003", name: "Safety Gloves XL", qty: 0, min: 50, unit: "pairs", location: "C-07", status: "out" },
  { sku: "WH-004", name: "Forklift Pallets", qty: 89, min: 30, unit: "pcs", location: "D-01", status: "ok" },
  { sku: "WH-005", name: "Hydraulic Oil 5L", qty: 23, min: 40, unit: "cans", location: "E-05", status: "low" },
  { sku: "WH-006", name: "Conveyor Belt 10m", qty: 7, min: 5, unit: "rolls", location: "F-02", status: "ok" },
];

const botConversation = [
  { from: "user", text: "CHECK WH-002", time: "09:14" },
  { from: "bot", text: "📦 SKU: WH-002\nItem: Steel Pipe 2in\nQty: 142m @ B-03\n⚠️ BELOW MINIMUM (200m)\nLast updated: 2 min ago", time: "09:14" },
  { from: "user", text: "ADD WH-002 50", time: "09:15" },
  { from: "bot", text: "✅ Updated!\nWH-002 Steel Pipe 2in\n142m → 192m\nStill below min threshold.\nCreate purchase order? Reply YES/NO", time: "09:15" },
  { from: "user", text: "YES", time: "09:16" },
  { from: "bot", text: "📋 PO-2024-0891 Created\nItem: Steel Pipe 2in\nQty: 100m (auto-suggested)\nVendor: SteelCo Ltd\nETA: 3-5 business days\nApproval pending from: admin@warehouse.com", time: "09:16" },
  { from: "user", text: "LOW STOCK", time: "09:17" },
  { from: "bot", text: "⚠️ LOW STOCK ALERTS (2)\n\n• WH-002 Steel Pipe: 192/200m\n• WH-005 Hydraulic Oil: 23/40 cans\n\n❌ OUT OF STOCK (1)\n• WH-003 Safety Gloves: 0/50 pairs\n\nReply REORDER ALL to bulk order", time: "09:17" },
];

const commands = [
  { cmd: "CHECK [SKU]", desc: "Get stock level for any item" },
  { cmd: "ADD [SKU] [QTY]", desc: "Add inventory received" },
  { cmd: "REMOVE [SKU] [QTY]", desc: "Deduct stock used/sold" },
  { cmd: "LOW STOCK", desc: "List all below-minimum items" },
  { cmd: "OUT OF STOCK", desc: "Items with zero inventory" },
  { cmd: "REORDER [SKU]", desc: "Create purchase order" },
  { cmd: "SEARCH [NAME]", desc: "Find items by keyword" },
  { cmd: "REPORT DAILY", desc: "Full inventory report PDF" },
];

const plans = [
  {
    name: "STARTER",
    price: 29,
    desc: "Single warehouse, small team",
    features: ["1 WhatsApp Number", "Up to 500 SKUs", "3 Users", "Basic Reports", "Email Support"],
    color: COLORS.blue,
  },
  {
    name: "OPERATIONS",
    price: 89,
    desc: "Growing businesses",
    features: ["3 WhatsApp Numbers", "Up to 5,000 SKUs", "15 Users", "PO Automation", "Priority Support", "Webhook Integrations"],
    color: COLORS.amber,
    highlight: true,
  },
  {
    name: "ENTERPRISE",
    price: 249,
    desc: "Multi-site logistics",
    features: ["Unlimited Numbers", "Unlimited SKUs", "Unlimited Users", "Custom Commands", "ERP Integration", "Dedicated Support", "SLA 99.9%"],
    color: COLORS.green,
  },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Nav({ active, setActive }) {
  const tabs = ["OVERVIEW", "DASHBOARD", "BOT SIM", "ARCHITECTURE", "PRICING"];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: `${COLORS.bg}ee`,
      borderBottom: `1px solid ${COLORS.border}`,
      backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 40px", height: 56,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 28, height: 28, background: COLORS.amber,
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }} />
        <span className="bebas" style={{ fontSize: 22, letterSpacing: "0.1em", color: COLORS.text }}>
          STOCKBOT
        </span>
        <span className="mono" style={{ fontSize: 10, color: COLORS.amberDim, letterSpacing: "0.1em", marginLeft: 4 }}>
          WMS v2.4
        </span>
      </div>
      <div style={{ display: "flex", gap: 32 }}>
        {tabs.map(t => (
          <span key={t} className={`nav-link ${active === t ? "active" : ""}`} onClick={() => setActive(t)}>{t}</span>
        ))}
      </div>
      <button className="btn-primary" style={{ padding: "8px 20px", fontSize: 12 }}>
        START FREE TRIAL
      </button>
    </nav>
  );
}

function Ticker() {
  const items = ["✓ 99.9% Uptime SLA", "⚡ &lt;200ms Response", "🔒 SOC2 Compliant", "📦 50,000+ SKUs Managed", "🌍 23 Countries", "💬 WhatsApp Business API Certified"];
  const text = [...items, ...items].join("   •   ");
  return (
    <div style={{
      background: COLORS.amberDim, borderBottom: `1px solid ${COLORS.amber}44`,
      overflow: "hidden", padding: "6px 0",
    }}>
      <div className="mono" style={{
        display: "inline-block", whiteSpace: "nowrap",
        animation: "ticker 30s linear infinite",
        fontSize: 11, letterSpacing: "0.08em", color: COLORS.amber,
      }}
        dangerouslySetInnerHTML={{ __html: text + "   •   " + text }}
      />
    </div>
  );
}

// ─── OVERVIEW ────────────────────────────────────────────────────────────────

function Overview() {
  return (
    <div style={{ paddingTop: 100 }}>
      <Ticker />

      {/* Hero */}
      <div style={{
        position: "relative", minHeight: "88vh",
        display: "flex", alignItems: "center",
        overflow: "hidden",
      }}>
        {/* Grid bg */}
        <div className="grid-bg" style={{
          position: "absolute", inset: 0, opacity: 0.4,
        }} />
        {/* Amber glow */}
        <div style={{
          position: "absolute", right: "10%", top: "20%",
          width: 500, height: 500,
          background: `radial-gradient(circle, ${COLORS.amber}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "0 40px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: COLORS.green,
              animation: "pulse-amber 2s infinite",
              boxShadow: `0 0 8px ${COLORS.green}`,
            }} />
            <span className="mono" style={{ fontSize: 12, color: COLORS.green, letterSpacing: "0.15em" }}>
              LIVE • PRODUCTION READY
            </span>
          </div>

          <h1 className="bebas" style={{
            fontSize: "clamp(64px, 10vw, 130px)",
            lineHeight: 0.9,
            letterSpacing: "0.02em",
            color: COLORS.text,
            marginBottom: 8,
          }}>
            WAREHOUSE<br />
            <span style={{ color: COLORS.amber }}>INVENTORY</span><br />
            ON WHATSAPP
          </h1>

          <p style={{
            fontSize: 18, color: COLORS.textMuted, maxWidth: 520,
            lineHeight: 1.6, marginTop: 24, marginBottom: 40,
            fontWeight: 300,
          }}>
            Your warehouse team already uses WhatsApp. Now let them check stock, log movements, and trigger purchase orders — without leaving the chat.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button className="btn-primary">Start Free Trial →</button>
            <button className="btn-ghost">Watch Demo</button>
          </div>

          {/* Stats row */}
          <div style={{
            display: "flex", gap: 40, marginTop: 64, paddingTop: 40,
            borderTop: `1px solid ${COLORS.border}`,
            flexWrap: "wrap",
          }}>
            {[
              { val: "2.3M+", label: "Messages Processed" },
              { val: "847", label: "Warehouses Active" },
              { val: "99.97%", label: "Uptime Last 90d" },
              { val: "<180ms", label: "Avg Response Time" },
            ].map(s => (
              <div key={s.label}>
                <div className="bebas" style={{ fontSize: 40, color: COLORS.amber, letterSpacing: "0.05em" }}>{s.val}</div>
                <div className="mono" style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Phone mockup */}
        <div style={{
          position: "absolute", right: "5%", top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.85,
        }}>
          <MiniPhone />
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ marginBottom: 48 }}>
          <span className="tag" style={{ borderColor: COLORS.amberDim, color: COLORS.amber }}>CAPABILITIES</span>
          <h2 className="bebas" style={{ fontSize: 52, marginTop: 12, letterSpacing: "0.04em" }}>WHAT IT DOES</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 1 }}>
          {[
            { icon: "📦", title: "REAL-TIME STOCK CHECKS", desc: "Any team member can check any SKU instantly via WhatsApp. No app install, no training." },
            { icon: "➕", title: "LOG MOVEMENTS", desc: "Add received stock or deduct used items with simple commands. Auto-timestamped." },
            { icon: "⚠️", title: "LOW STOCK ALERTS", desc: "Automatic alerts when inventory drops below your defined thresholds. Never run out." },
            { icon: "📋", title: "PURCHASE ORDERS", desc: "Bot generates POs automatically. Manager approves via WhatsApp. Done." },
            { icon: "📊", title: "DAILY REPORTS", desc: "Scheduled PDF/CSV reports sent directly to manager's WhatsApp every morning." },
            { icon: "🔗", title: "ERP INTEGRATION", desc: "Connects to SAP, Oracle, QuickBooks and more via webhook API. No data silos." },
          ].map(f => (
            <div key={f.title} className="card" style={{ padding: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: COLORS.amber, letterSpacing: "0.1em", marginBottom: 8 }}>{f.title}</div>
              <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniPhone() {
  const [msgIdx, setMsgIdx] = useState(0);
  const msgs = botConversation.slice(0, 4);

  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % msgs.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      width: 280, background: "#0a0a0a",
      border: `1px solid ${COLORS.border}`,
      borderRadius: 32,
      padding: 4,
      boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 40px ${COLORS.amber}18`,
    }}>
      {/* Screen */}
      <div style={{
        background: "#e5ddd5",
        borderRadius: 28,
        overflow: "hidden",
        minHeight: 500,
      }}>
        {/* WA header */}
        <div style={{
          background: "#075e54",
          padding: "16px 16px 12px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.amber, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏭</div>
          <div>
            <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>StockBot WMS</div>
            <div style={{ color: "#b2dfdb", fontSize: 11 }}>online</div>
          </div>
        </div>
        {/* Messages */}
        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {msgs.slice(0, msgIdx + 1).map((m, i) => (
            <div key={i} className="whatsapp-msg" style={{
              alignSelf: m.from === "user" ? "flex-end" : "flex-start",
              background: m.from === "user" ? "#dcf8c6" : "#fff",
              borderRadius: m.from === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              padding: "8px 10px",
              maxWidth: "85%",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}>
              <div style={{
                fontSize: 12, color: "#303030", whiteSpace: "pre-wrap",
                fontFamily: "'IBM Plex Mono', monospace",
                lineHeight: 1.5,
              }}>{m.text}</div>
              <div style={{ fontSize: 10, color: "#999", textAlign: "right", marginTop: 2 }}>{m.time} ✓✓</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

function Dashboard() {
  const [selected, setSelected] = useState(null);

  const statusColor = (s) => ({ ok: COLORS.green, low: COLORS.amber, out: COLORS.red }[s]);

  const totals = {
    total: inventory.length,
    ok: inventory.filter(i => i.status === "ok").length,
    low: inventory.filter(i => i.status === "low").length,
    out: inventory.filter(i => i.status === "out").length,
  };

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: COLORS.bg }}>
      {/* Top bar */}
      <div style={{
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "16px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: COLORS.surface,
      }}>
        <div>
          <div className="bebas" style={{ fontSize: 28, letterSpacing: "0.08em" }}>WAREHOUSE DASHBOARD</div>
          <div className="mono" style={{ fontSize: 11, color: COLORS.textMuted }}>
            SITE: MAIN-WH-01 • LAST SYNC: <span style={{ color: COLORS.green }}>2 MIN AGO</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="stat-badge">
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.green, animation: "pulse-amber 2s infinite" }} />
            BOT ONLINE
          </div>
          <div className="stat-badge" style={{ borderColor: COLORS.blue, color: COLORS.blue, background: `${COLORS.blue}11` }}>
            ⚡ 14 MSGS TODAY
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 40px", maxWidth: 1400, margin: "0 auto" }}>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "TOTAL SKUS", val: totals.total, color: COLORS.text, icon: "📦" },
            { label: "IN STOCK", val: totals.ok, color: COLORS.green, icon: "✅" },
            { label: "LOW STOCK", val: totals.low, color: COLORS.amber, icon: "⚠️" },
            { label: "OUT OF STOCK", val: totals.out, color: COLORS.red, icon: "❌" },
          ].map(k => (
            <div key={k.label} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div className="mono" style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: "0.12em", marginBottom: 8 }}>{k.label}</div>
                  <div className="bebas" style={{ fontSize: 44, color: k.color, lineHeight: 1 }}>{k.val}</div>
                </div>
                <span style={{ fontSize: 24 }}>{k.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
          {/* Inventory Table */}
          <div className="card">
            <div style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${COLORS.border}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div className="mono" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em" }}>INVENTORY REGISTER</div>
              <input
                placeholder="SEARCH SKU..."
                className="mono"
                style={{
                  background: COLORS.surfaceHigh, border: `1px solid ${COLORS.border}`,
                  padding: "6px 12px", color: COLORS.text, fontSize: 11,
                  outline: "none", width: 160,
                  letterSpacing: "0.08em",
                }}
              />
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  {["SKU", "ITEM NAME", "QTY", "MIN", "LOCATION", "STATUS", ""].map(h => (
                    <th key={h} className="mono" style={{
                      padding: "10px 16px", textAlign: "left",
                      fontSize: 10, color: COLORS.textMuted, letterSpacing: "0.12em",
                      fontWeight: 600,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inventory.map((item, i) => (
                  <tr
                    key={item.sku}
                    onClick={() => setSelected(item)}
                    style={{
                      borderBottom: `1px solid ${COLORS.border}`,
                      cursor: "pointer",
                      background: selected?.sku === item.sku ? `${COLORS.amber}0a` : "transparent",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = `${COLORS.surfaceHigh}`}
                    onMouseLeave={e => e.currentTarget.style.background = selected?.sku === item.sku ? `${COLORS.amber}0a` : "transparent"}
                  >
                    <td className="mono" style={{ padding: "12px 16px", fontSize: 12, color: COLORS.amber }}>{item.sku}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13 }}>{item.name}</td>
                    <td className="mono" style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: statusColor(item.status) }}>
                      {item.qty.toLocaleString()} {item.unit}
                    </td>
                    <td className="mono" style={{ padding: "12px 16px", fontSize: 12, color: COLORS.textMuted }}>
                      {item.min} {item.unit}
                    </td>
                    <td className="mono" style={{ padding: "12px 16px", fontSize: 12 }}>{item.location}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        padding: "3px 8px",
                        background: `${statusColor(item.status)}22`,
                        border: `1px solid ${statusColor(item.status)}66`,
                        color: statusColor(item.status),
                        fontSize: 10, fontFamily: "'IBM Plex Mono'",
                        letterSpacing: "0.1em", textTransform: "uppercase",
                      }}>
                        {item.status === "ok" ? "IN STOCK" : item.status === "low" ? "LOW" : "OUT"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button className="mono" style={{
                        background: "none", border: `1px solid ${COLORS.border}`,
                        color: COLORS.textMuted, padding: "4px 10px",
                        fontSize: 10, cursor: "pointer", letterSpacing: "0.08em",
                      }}>EDIT</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Side panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Bot Activity */}
            <div className="card" style={{ padding: 20 }}>
              <div className="mono" style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: "0.12em", marginBottom: 16 }}>
                BOT ACTIVITY LOG
              </div>
              {[
                { cmd: "CHECK WH-002", user: "Ahmed K.", time: "2m ago", ok: true },
                { cmd: "LOW STOCK", user: "Priya S.", time: "15m ago", ok: true },
                { cmd: "ADD WH-004 20", user: "Ahmed K.", time: "1h ago", ok: true },
                { cmd: "REORDER WH-003", user: "System", time: "2h ago", ok: true },
                { cmd: "REPORT DAILY", user: "System", time: "8h ago", ok: true },
              ].map((a, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 0",
                  borderBottom: i < 4 ? `1px solid ${COLORS.border}` : "none",
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.green, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="mono" style={{ fontSize: 11, color: COLORS.amber }}>{a.cmd}</div>
                    <div className="mono" style={{ fontSize: 10, color: COLORS.textMuted }}>{a.user}</div>
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: COLORS.textDim }}>{a.time}</div>
                </div>
              ))}
            </div>

            {/* Alerts */}
            <div className="card" style={{ padding: 20 }}>
              <div className="mono" style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: "0.12em", marginBottom: 16 }}>
                ACTIVE ALERTS
              </div>
              {inventory.filter(i => i.status !== "ok").map(item => (
                <div key={item.sku} style={{
                  padding: "10px 12px",
                  background: `${statusColor(item.status)}11`,
                  border: `1px solid ${statusColor(item.status)}44`,
                  marginBottom: 8,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div className="mono" style={{ fontSize: 11, color: statusColor(item.status) }}>{item.sku}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted }}>{item.name}</div>
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: statusColor(item.status), fontWeight: 600 }}>
                    {item.qty}/{item.min}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BOT SIMULATOR ───────────────────────────────────────────────────────────

function BotSim() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Welcome to StockBot WMS!\n\nI'm your warehouse assistant. Type a command to get started.\n\nTry: CHECK WH-001", time: now() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function now() {
    return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }

  function processCommand(cmd) {
    const c = cmd.trim().toUpperCase();
    const parts = c.split(" ");

    if (parts[0] === "CHECK" && parts[1]) {
      const item = inventory.find(i => i.sku === parts[1]);
      if (item) {
        const statusEmoji = { ok: "✅", low: "⚠️", out: "❌" }[item.status];
        return `${statusEmoji} SKU: ${item.sku}\nItem: ${item.name}\nQty: ${item.qty} ${item.unit}\nLocation: ${item.location}\nMin threshold: ${item.min} ${item.unit}\nStatus: ${item.status.toUpperCase()}`;
      }
      return `❌ SKU "${parts[1]}" not found.\nTry: CHECK WH-001 through WH-006`;
    }

    if (parts[0] === "ADD" && parts[1] && parts[2]) {
      const item = inventory.find(i => i.sku === parts[1]);
      const qty = parseInt(parts[2]);
      if (item && !isNaN(qty)) {
        return `✅ Stock Updated!\n${item.sku}: ${item.name}\n${item.qty} → ${item.qty + qty} ${item.unit}\nUpdated by: Demo User\nTimestamp: ${now()}`;
      }
    }

    if (c === "LOW STOCK") {
      const low = inventory.filter(i => i.status === "low" || i.status === "out");
      if (low.length === 0) return "✅ All items are above minimum threshold!";
      return `⚠️ STOCK ALERTS (${low.length} items)\n\n` + low.map(i =>
        `• ${i.sku} ${i.name}: ${i.qty}/${i.min} ${i.unit} [${i.status.toUpperCase()}]`
      ).join("\n");
    }

    if (c === "HELP") {
      return "📋 AVAILABLE COMMANDS:\n\n" + commands.map(cmd => `• ${cmd.cmd}\n  ${cmd.desc}`).join("\n\n");
    }

    if (c === "REPORT DAILY") {
      return "📊 DAILY REPORT QUEUED\n\nReport for: " + new Date().toDateString() + "\nFormat: PDF + CSV\nDelivery: This chat + admin@warehouse.com\nETA: ~30 seconds\n\nNote: Demo mode — actual report not generated";
    }

    if (parts[0] === "SEARCH" && parts[1]) {
      const q = parts.slice(1).join(" ");
      const found = inventory.filter(i => i.name.toLowerCase().includes(q.toLowerCase()));
      if (found.length === 0) return `🔍 No items found matching "${q}"`;
      return `🔍 Search results for "${q}":\n\n` + found.map(i => `• ${i.sku}: ${i.name} — ${i.qty} ${i.unit}`).join("\n");
    }

    return `❓ Unknown command: "${cmd}"\n\nType HELP for available commands.`;
  }

  function send() {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input, time: now() };
    setMessages(m => [...m, userMsg]);
    const cmd = input;
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { from: "bot", text: processCommand(cmd), time: now() }]);
    }, 800 + Math.random() * 400);
  }

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "40px 40px 0",
        width: "100%",
      }}>
        <div style={{ marginBottom: 32 }}>
          <span className="tag" style={{ borderColor: COLORS.amberDim, color: COLORS.amber }}>INTERACTIVE DEMO</span>
          <h2 className="bebas" style={{ fontSize: 52, marginTop: 12, letterSpacing: "0.04em" }}>TRY THE BOT</h2>
          <p style={{ color: COLORS.textMuted, marginTop: 8 }}>Live simulator — type real commands below</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>
          {/* Phone */}
          <div className="card" style={{ overflow: "hidden" }}>
            {/* WA Header */}
            <div style={{
              background: "#075e54", padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.amber, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏭</div>
              <div>
                <div style={{ color: "#fff", fontWeight: 600 }}>StockBot WMS</div>
                <div style={{ color: "#b2dfdb", fontSize: 12 }}>
                  {typing ? "typing..." : "online"}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              background: "#e5ddd5",
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              height: 400, overflowY: "auto",
              padding: 16, display: "flex", flexDirection: "column", gap: 8,
            }}>
              {messages.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  animation: "slide-up 0.3s ease",
                }}>
                  <div style={{
                    background: m.from === "user" ? "#dcf8c6" : "#fff",
                    borderRadius: m.from === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                    padding: "8px 12px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
                  }}>
                    <div style={{
                      fontSize: 13, color: "#303030",
                      whiteSpace: "pre-wrap", lineHeight: 1.5,
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}>{m.text}</div>
                    <div style={{ fontSize: 10, color: "#999", textAlign: "right", marginTop: 4 }}>
                      {m.time} {m.from === "user" ? "✓✓" : ""}
                    </div>
                  </div>
                </div>
              ))}
              {typing && (
                <div style={{ alignSelf: "flex-start" }}>
                  <div style={{ background: "#fff", borderRadius: "12px 12px 12px 2px", padding: "12px 16px", boxShadow: "0 1px 2px rgba(0,0,0,0.12)" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{
                          width: 8, height: 8, borderRadius: "50%", background: "#999",
                          animation: `pulse-amber 1s ${i * 0.2}s infinite`,
                        }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{
              background: "#f0f0f0", padding: "12px 16px",
              display: "flex", gap: 10, alignItems: "center",
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Type a command... (e.g. CHECK WH-001)"
                style={{
                  flex: 1, background: "#fff", border: "none",
                  borderRadius: 20, padding: "10px 16px",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 13, outline: "none", color: "#303030",
                }}
              />
              <button
                onClick={send}
                style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: "#075e54", border: "none",
                  color: "#fff", fontSize: 18, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >➤</button>
            </div>
          </div>

          {/* Commands reference */}
          <div className="card" style={{ padding: 20 }}>
            <div className="mono" style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: "0.12em", marginBottom: 16 }}>
              COMMAND REFERENCE
            </div>
            {commands.map((c, i) => (
              <div
                key={c.cmd}
                onClick={() => setInput(c.cmd.replace("[SKU]", "WH-002").replace("[QTY]", "50").replace("[NAME]", "bolt"))}
                style={{
                  padding: "10px 0",
                  borderBottom: i < commands.length - 1 ? `1px solid ${COLORS.border}` : "none",
                  cursor: "pointer",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <div className="mono" style={{ fontSize: 12, color: COLORS.amber, marginBottom: 3 }}>{c.cmd}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{c.desc}</div>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: "10px", background: `${COLORS.amber}11`, border: `1px solid ${COLORS.amberDim}` }}>
              <div className="mono" style={{ fontSize: 10, color: COLORS.amber }}>💡 Click any command to auto-fill</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ARCHITECTURE ─────────────────────────────────────────────────────────────

function Architecture() {
  const [active, setActive] = useState(null);

  const nodes = [
    { id: "user", label: "WAREHOUSE MANAGER", sub: "WhatsApp User", icon: "👷", color: COLORS.blue, desc: "Staff send natural commands via WhatsApp. No app download needed. Works on any phone." },
    { id: "wa", label: "WHATSAPP BUSINESS API", sub: "Twilio / Meta Cloud API", icon: "💬", color: "#25d366", desc: "Official WhatsApp Business API handles message delivery. Uses Twilio or Meta's own cloud API for reliability." },
    { id: "webhook", label: "WEBHOOK API SERVER", sub: "Node.js / Python FastAPI", icon: "⚡", color: COLORS.amber, desc: "Receives webhook events, parses commands, validates users, and orchestrates the business logic layer." },
    { id: "parser", label: "COMMAND PARSER", sub: "NLP + Rule Engine", icon: "🔍", color: COLORS.amber, desc: "Tokenizes and interprets commands. Handles variations like 'check stock bolt M12' or exact SKU codes." },
    { id: "inventory", label: "INVENTORY SERVICE", sub: "Business Logic Layer", icon: "📦", color: COLORS.amber, desc: "Core CRUD operations, threshold checking, PO generation, multi-location support, audit logging." },
    { id: "db", label: "DATABASE", sub: "PostgreSQL / Firebase", icon: "🗄️", color: COLORS.blue, desc: "Primary datastore for all SKUs, movements, users, and audit trails. Redis cache for frequently checked items." },
    { id: "dashboard", label: "ADMIN DASHBOARD", sub: "React / Next.js", icon: "📊", color: COLORS.green, desc: "Real-time visibility for managers. Inventory tables, movement history, bot logs, user management." },
    { id: "cloud", label: "CLOUD HOSTING", sub: "AWS / DigitalOcean / Vercel", icon: "☁️", color: "#60a5fa", desc: "Auto-scaling infrastructure. API on containerized Node/Python, DB on managed PostgreSQL, dashboard on Vercel." },
  ];

  const activeNode = nodes.find(n => n.id === active);

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 40px" }}>
        <div style={{ marginBottom: 40 }}>
          <span className="tag" style={{ borderColor: COLORS.amberDim, color: COLORS.amber }}>SYSTEM DESIGN</span>
          <h2 className="bebas" style={{ fontSize: 52, marginTop: 12, letterSpacing: "0.04em" }}>ARCHITECTURE</h2>
          <p style={{ color: COLORS.textMuted, marginTop: 8 }}>Click any node to learn more</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32, alignItems: "start" }}>
          {/* Flow diagram */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            {nodes.map((node, i) => (
              <div key={node.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <div
                  onClick={() => setActive(active === node.id ? null : node.id)}
                  className="arch-node"
                  style={{
                    width: "100%", maxWidth: 480,
                    background: active === node.id ? `${node.color}22` : COLORS.surface,
                    border: `1px solid ${active === node.id ? node.color : COLORS.border}`,
                    padding: "16px 24px",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 16,
                    transition: "all 0.2s",
                    boxShadow: active === node.id ? `0 0 24px ${node.color}33` : "none",
                  }}
                >
                  <span style={{ fontSize: 24 }}>{node.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: node.color, letterSpacing: "0.08em" }}>{node.label}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{node.sub}</div>
                  </div>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: node.color,
                    boxShadow: `0 0 8px ${node.color}`,
                    animation: "pulse-amber 2s infinite",
                  }} />
                </div>
                {i < nodes.length - 1 && (
                  <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    padding: "4px 0",
                  }}>
                    <div style={{ width: 1, height: 16, background: COLORS.border }} />
                    <div style={{ color: COLORS.amber, fontSize: 14 }}>▼</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Info panel */}
          <div style={{ position: "sticky", top: 80 }}>
            {activeNode ? (
              <div className="card" style={{ padding: 24, animation: "fadeIn 0.2s ease" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{activeNode.icon}</div>
                <div className="mono" style={{ fontSize: 14, fontWeight: 600, color: activeNode.color, letterSpacing: "0.08em", marginBottom: 4 }}>
                  {activeNode.label}
                </div>
                <div className="mono" style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 16 }}>{activeNode.sub}</div>
                <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7 }}>{activeNode.desc}</p>
              </div>
            ) : (
              <div className="card" style={{ padding: 24 }}>
                <div className="mono" style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 16, letterSpacing: "0.1em" }}>TECH STACK</div>
                {[
                  { label: "Runtime", val: "Node.js 20 / Python 3.11" },
                  { label: "Database", val: "PostgreSQL 16 + Redis" },
                  { label: "API", val: "REST + WebSocket" },
                  { label: "Auth", val: "JWT + WhatsApp verify" },
                  { label: "Queue", val: "BullMQ / Celery" },
                  { label: "Deploy", val: "Docker + K8s" },
                  { label: "Monitor", val: "Datadog / Sentry" },
                ].map(s => (
                  <div key={s.label} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`,
                  }}>
                    <span className="mono" style={{ fontSize: 11, color: COLORS.textMuted }}>{s.label}</span>
                    <span className="mono" style={{ fontSize: 11, color: COLORS.text }}>{s.val}</span>
                  </div>
                ))}
                <div style={{ marginTop: 16, color: COLORS.textMuted, fontSize: 12 }}>← Click a node to explore</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PRICING ─────────────────────────────────────────────────────────────────

function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="tag" style={{ borderColor: COLORS.amberDim, color: COLORS.amber }}>SIMPLE PRICING</span>
          <h2 className="bebas" style={{ fontSize: 64, marginTop: 12, letterSpacing: "0.04em" }}>CHOOSE YOUR PLAN</h2>
          <p style={{ color: COLORS.textMuted, marginTop: 8, fontSize: 16 }}>All plans include 14-day free trial. No credit card required.</p>

          {/* Toggle */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            marginTop: 24, padding: "8px 16px",
            background: COLORS.surface, border: `1px solid ${COLORS.border}`,
          }}>
            <span className="mono" style={{ fontSize: 12, color: annual ? COLORS.textMuted : COLORS.text }}>MONTHLY</span>
            <div
              onClick={() => setAnnual(!annual)}
              style={{
                width: 44, height: 24, borderRadius: 12,
                background: annual ? COLORS.amber : COLORS.border,
                position: "relative", cursor: "pointer", transition: "background 0.2s",
              }}
            >
              <div style={{
                position: "absolute", top: 3, left: annual ? 23 : 3,
                width: 18, height: 18, borderRadius: "50%", background: "#fff",
                transition: "left 0.2s",
              }} />
            </div>
            <span className="mono" style={{ fontSize: 12, color: annual ? COLORS.text : COLORS.textMuted }}>
              ANNUAL <span style={{ color: COLORS.green }}>-20%</span>
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
          {plans.map(plan => (
            <div
              key={plan.name}
              style={{
                background: plan.highlight ? `${COLORS.amber}0a` : COLORS.surface,
                border: `1px solid ${plan.highlight ? COLORS.amber : COLORS.border}`,
                padding: 36,
                position: "relative",
                boxShadow: plan.highlight ? `0 0 40px ${COLORS.amber}18` : "none",
              }}
            >
              {plan.highlight && (
                <div style={{
                  position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                  background: COLORS.amber, color: "#000",
                  padding: "4px 16px",
                  fontFamily: "'IBM Plex Mono'", fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.15em",
                }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ marginBottom: 24 }}>
                <div className="bebas" style={{ fontSize: 32, color: plan.color, letterSpacing: "0.08em" }}>{plan.name}</div>
                <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>{plan.desc}</div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span className="bebas" style={{ fontSize: 56, color: COLORS.text }}>
                    ${annual ? Math.round(plan.price * 0.8) : plan.price}
                  </span>
                  <span className="mono" style={{ fontSize: 12, color: COLORS.textMuted }}>/mo</span>
                </div>
                {annual && (
                  <div className="mono" style={{ fontSize: 11, color: COLORS.green }}>
                    Save ${Math.round(plan.price * 0.2 * 12)}/year
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: plan.color, fontSize: 14 }}>✓</span>
                    <span style={{ fontSize: 13, color: COLORS.textMuted }}>{f}</span>
                  </div>
                ))}
              </div>

              <button
                style={{
                  width: "100%", padding: "14px",
                  background: plan.highlight ? COLORS.amber : "transparent",
                  border: `1px solid ${plan.highlight ? COLORS.amber : COLORS.border}`,
                  color: plan.highlight ? "#000" : COLORS.text,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 13, fontWeight: 600,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { if (!plan.highlight) { e.target.style.borderColor = COLORS.amber; e.target.style.color = COLORS.amber; } }}
                onMouseLeave={e => { if (!plan.highlight) { e.target.style.borderColor = COLORS.border; e.target.style.color = COLORS.text; } }}
              >
                START FREE TRIAL →
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 72 }}>
          <h3 className="bebas" style={{ fontSize: 36, textAlign: "center", marginBottom: 32, letterSpacing: "0.06em" }}>COMMON QUESTIONS</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            {[
              { q: "Which WhatsApp API do you use?", a: "We support both Meta's official Cloud API and Twilio's WhatsApp API. You can bring your own Business Account or use our managed setup." },
              { q: "Can I import existing inventory?", a: "Yes. Upload CSV/Excel files or connect via API to migrate from any existing WMS, spreadsheets, or ERP system." },
              { q: "What happens if the bot is offline?", a: "We guarantee 99.9% uptime via multi-region deployment. Downtime alerts go to your admin WhatsApp automatically." },
              { q: "Is there a message limit?", a: "No message limits on any plan. Pricing is based on team size and SKU count, not message volume." },
            ].map(faq => (
              <div key={faq.q} className="card" style={{ padding: 24 }}>
                <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: COLORS.amber, marginBottom: 10 }}>{faq.q}</div>
                <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("OVERVIEW");

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg }}>
      <style>{globalStyles}</style>
      <Nav active={tab} setActive={setTab} />

      {tab === "OVERVIEW" && <Overview />}
      {tab === "DASHBOARD" && <Dashboard />}
      {tab === "BOT SIM" && <BotSim />}
      {tab === "ARCHITECTURE" && <Architecture />}
      {tab === "PRICING" && <Pricing />}

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${COLORS.border}`,
        padding: "24px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: 80,
      }}>
        <div className="mono" style={{ fontSize: 11, color: COLORS.textDim }}>
          © 2025 STOCKBOT WMS — WAREHOUSE INTELLIGENCE ON WHATSAPP
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["DOCS", "API", "STATUS", "PRIVACY"].map(l => (
            <span key={l} className="nav-link mono" style={{ fontSize: 11 }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
