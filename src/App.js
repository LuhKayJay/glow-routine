import { useState, useEffect } from “react”;

const ROUTINE = {
morning: [
{ id: “cleanser”, name: “Glucoside Foaming Cleanser”, brand: “The Ordinary” },
{ id: “serum”, name: “Glow Serum Propolis + Niacinamide”, brand: “Beauty of Joseon” },
{ id: “moisturizer”, name: “Hydro Boost Water Gel”, brand: “Neutrogena” },
{ id: “spf”, name: “Kids SPF 30”, brand: “Black Girl Sunscreen” },
],
monday: [
{ id: “cleanser”, name: “Glucoside Foaming Cleanser”, brand: “The Ordinary” },
{ id: “serum”, name: “Glow Serum Propolis + Niacinamide”, brand: “Beauty of Joseon” },
{ id: “salicylic”, name: “Salicylic Acid 2% Solution”, brand: “The Ordinary” },
{ id: “nmf”, name: “Natural Moisturizing Factors”, brand: “The Ordinary” },
{ id: “pair”, name: “Acne Cream W (spot treat)”, brand: “PAIR” },
],
wednesday: [
{ id: “cleanser”, name: “Glucoside Foaming Cleanser”, brand: “The Ordinary” },
{ id: “serum”, name: “Glow Serum Propolis + Niacinamide”, brand: “Beauty of Joseon” },
{ id: “salicylic”, name: “Salicylic Acid 2% Solution”, brand: “The Ordinary” },
{ id: “nmf”, name: “Natural Moisturizing Factors”, brand: “The Ordinary” },
{ id: “pair”, name: “Acne Cream W (spot treat)”, brand: “PAIR” },
],
friday: [
{ id: “cleanser”, name: “Glucoside Foaming Cleanser”, brand: “The Ordinary” },
{ id: “serum”, name: “Glow Serum Propolis + Niacinamide”, brand: “Beauty of Joseon” },
{ id: “salicylic”, name: “Salicylic Acid 2% Solution”, brand: “The Ordinary” },
{ id: “nmf”, name: “Natural Moisturizing Factors”, brand: “The Ordinary” },
{ id: “pair”, name: “Acne Cream W (spot treat)”, brand: “PAIR” },
],
tuesday: [
{ id: “cleanser”, name: “Glucoside Foaming Cleanser”, brand: “The Ordinary” },
{ id: “serum”, name: “Glow Serum Propolis + Niacinamide”, brand: “Beauty of Joseon” },
{ id: “retinol”, name: “Retinol Serum”, brand: “AOA” },
{ id: “nmf”, name: “Natural Moisturizing Factors”, brand: “The Ordinary” },
{ id: “pair”, name: “Acne Cream W (spot treat)”, brand: “PAIR” },
],
thursday: [
{ id: “cleanser”, name: “Glucoside Foaming Cleanser”, brand: “The Ordinary” },
{ id: “serum”, name: “Glow Serum Propolis + Niacinamide”, brand: “Beauty of Joseon” },
{ id: “retinol”, name: “Retinol Serum”, brand: “AOA” },
{ id: “nmf”, name: “Natural Moisturizing Factors”, brand: “The Ordinary” },
{ id: “pair”, name: “Acne Cream W (spot treat)”, brand: “PAIR” },
],
saturday: [
{ id: “cleanser”, name: “Glucoside Foaming Cleanser”, brand: “The Ordinary” },
{ id: “mugwort”, name: “Mugwort Acne Clay Stick (T-zone only)”, brand: “SKINTIFIC” },
{ id: “nmf”, name: “Natural Moisturizing Factors”, brand: “The Ordinary” },
{ id: “pair”, name: “Acne Cream W (spot treat)”, brand: “PAIR” },
],
sunday: [
{ id: “cleanser”, name: “Glucoside Foaming Cleanser”, brand: “The Ordinary” },
{ id: “serum”, name: “Glow Serum Propolis + Niacinamide”, brand: “Beauty of Joseon” },
{ id: “retinol”, name: “Retinol Serum”, brand: “AOA” },
{ id: “nmf”, name: “Natural Moisturizing Factors”, brand: “The Ordinary” },
{ id: “pair”, name: “Acne Cream W (spot treat)”, brand: “PAIR” },
],
};

const DAYS = [“sunday”, “monday”, “tuesday”, “wednesday”, “thursday”, “friday”, “saturday”];
const DAY_LABELS = [“Sun”, “Mon”, “Tue”, “Wed”, “Thu”, “Fri”, “Sat”];

const getNightKey = (dayIndex) => DAYS[dayIndex];

export default function SkincareTracker() {
const today = new Date();
const todayDayIndex = today.getDay();
const todayKey = DAYS[todayDayIndex];
const todayStr = today.toISOString().split(“T”)[0];

const [activeTab, setActiveTab] = useState(“morning”);
const [checked, setChecked] = useState({});
const [streak, setStreak] = useState(0);
const [weekProgress, setWeekProgress] = useState({});

const storageKey = `skincare_${todayStr}`;

useEffect(() => {
const saved = localStorage.getItem(storageKey);
if (saved) setChecked(JSON.parse(saved));

```
// Calculate streak from last 7 days
let s = 0;
for (let i = 1; i <= 7; i++) {
  const d = new Date(today);
  d.setDate(d.getDate() - i);
  const k = `skincare_${d.toISOString().split("T")[0]}`;
  const data = localStorage.getItem(k);
  if (data) {
    const parsed = JSON.parse(data);
    const morningDone = Object.keys(parsed).filter(k => k.startsWith("morning_") && parsed[k]).length;
    if (morningDone > 0) s++;
    else break;
  } else break;
}
setStreak(s);

// Week progress
const wp = {};
for (let i = 0; i < 7; i++) {
  const d = new Date(today);
  d.setDate(d.getDate() - todayDayIndex + i);
  const k = `skincare_${d.toISOString().split("T")[0]}`;
  const data = localStorage.getItem(k);
  if (data) {
    const parsed = JSON.parse(data);
    const total = Object.keys(parsed).length;
    const done = Object.values(parsed).filter(Boolean).length;
    wp[i] = total > 0 ? Math.round((done / total) * 100) : 0;
  } else {
    wp[i] = i < todayDayIndex ? 0 : null;
  }
}
setWeekProgress(wp);
```

}, []);

const toggle = (key) => {
const updated = { …checked, [key]: !checked[key] };
setChecked(updated);
localStorage.setItem(storageKey, JSON.stringify(updated));
};

const nightSteps = ROUTINE[todayKey] || [];
const morningSteps = ROUTINE.morning;

const morningDone = morningSteps.filter(s => checked[`morning_${s.id}`]).length;
const nightDone = nightSteps.filter(s => checked[`night_${s.id}`]).length;
const totalDone = morningDone + nightDone;
const totalSteps = morningSteps.length + nightSteps.length;
const progressPct = Math.round((totalDone / totalSteps) * 100);

const currentSteps = activeTab === “morning” ? morningSteps : nightSteps;
const prefix = activeTab === “morning” ? “morning_” : “night_”;

return (
<div style={{
minHeight: “100vh”,
background: “linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a1a 100%)”,
fontFamily: “‘Georgia’, serif”,
color: “#f0e8e0”,
padding: “0”,
}}>
{/* Header */}
<div style={{
background: “linear-gradient(180deg, rgba(180,120,200,0.15) 0%, transparent 100%)”,
padding: “32px 20px 20px”,
textAlign: “center”,
borderBottom: “1px solid rgba(180,120,200,0.2)”,
}}>
<div style={{ fontSize: 11, letterSpacing: 4, color: “#b478c8”, textTransform: “uppercase”, marginBottom: 8 }}>
Your Skin Journey
</div>
<h1 style={{
fontSize: 28,
fontWeight: 400,
margin: “0 0 4px”,
background: “linear-gradient(135deg, #f0e8e0, #b478c8)”,
WebkitBackgroundClip: “text”,
WebkitTextFillColor: “transparent”,
letterSpacing: 1,
}}>
Glow Routine
</h1>
<div style={{ fontSize: 13, color: “rgba(240,232,224,0.5)”, letterSpacing: 1 }}>
{today.toLocaleDateString(“en-US”, { weekday: “long”, month: “long”, day: “numeric” })}
</div>
</div>

```
  {/* Streak + Progress */}
  <div style={{ padding: "20px 20px 0", display: "flex", gap: 12 }}>
    {/* Streak */}
    <div style={{
      flex: 1,
      background: "rgba(180,120,200,0.08)",
      border: "1px solid rgba(180,120,200,0.2)",
      borderRadius: 16,
      padding: "16px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: 32 }}>🔥</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#b478c8" }}>{streak}</div>
      <div style={{ fontSize: 11, color: "rgba(240,232,224,0.5)", letterSpacing: 2, textTransform: "uppercase" }}>Day Streak</div>
    </div>

    {/* Today Progress */}
    <div style={{
      flex: 2,
      background: "rgba(180,120,200,0.08)",
      border: "1px solid rgba(180,120,200,0.2)",
      borderRadius: 16,
      padding: "16px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: "rgba(240,232,224,0.5)", textTransform: "uppercase" }}>Today</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#b478c8" }}>{progressPct}%</div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 8, overflow: "hidden" }}>
        <div style={{
          width: `${progressPct}%`,
          height: "100%",
          background: "linear-gradient(90deg, #7a3a9a, #b478c8)",
          borderRadius: 99,
          transition: "width 0.5s ease",
        }} />
      </div>
      <div style={{ fontSize: 12, color: "rgba(240,232,224,0.4)", marginTop: 8 }}>
        {totalDone} of {totalSteps} steps done
      </div>
    </div>
  </div>

  {/* Week dots */}
  <div style={{ padding: "16px 20px 0", display: "flex", justifyContent: "space-between" }}>
    {DAY_LABELS.map((label, i) => (
      <div key={i} style={{ textAlign: "center", flex: 1 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          margin: "0 auto 4px",
          background: i === todayDayIndex
            ? "linear-gradient(135deg, #7a3a9a, #b478c8)"
            : weekProgress[i] > 0
              ? `rgba(180,120,200,${weekProgress[i] / 100 * 0.6})`
              : "rgba(255,255,255,0.05)",
          border: i === todayDayIndex ? "none" : "1px solid rgba(180,120,200,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          color: i === todayDayIndex ? "white" : "rgba(240,232,224,0.4)",
          fontWeight: i === todayDayIndex ? 700 : 400,
        }}>
          {weekProgress[i] === 100 ? "✓" : label.charAt(0)}
        </div>
        <div style={{ fontSize: 9, color: i === todayDayIndex ? "#b478c8" : "rgba(240,232,224,0.3)", letterSpacing: 1 }}>
          {label}
        </div>
      </div>
    ))}
  </div>

  {/* Tabs */}
  <div style={{ padding: "20px 20px 0", display: "flex", gap: 8 }}>
    {["morning", "night"].map(tab => (
      <button key={tab} onClick={() => setActiveTab(tab)} style={{
        flex: 1,
        padding: "12px",
        borderRadius: 12,
        border: activeTab === tab ? "none" : "1px solid rgba(180,120,200,0.2)",
        background: activeTab === tab
          ? "linear-gradient(135deg, #7a3a9a, #b478c8)"
          : "rgba(180,120,200,0.05)",
        color: activeTab === tab ? "white" : "rgba(240,232,224,0.5)",
        fontSize: 13,
        letterSpacing: 2,
        textTransform: "uppercase",
        cursor: "pointer",
        fontFamily: "Georgia, serif",
      }}>
        {tab === "morning" ? "☀️ Morning" : "🌙 Night"}
      </button>
    ))}
  </div>

  {/* Steps */}
  <div style={{ padding: "16px 20px 100px" }}>
    {activeTab === "night" && (
      <div style={{
        fontSize: 11,
        letterSpacing: 2,
        color: "#b478c8",
        textTransform: "uppercase",
        marginBottom: 12,
        textAlign: "center",
      }}>
        {todayKey.charAt(0).toUpperCase() + todayKey.slice(1)} Night Routine
      </div>
    )}

    {currentSteps.length === 0 && (
      <div style={{
        textAlign: "center",
        padding: "40px 20px",
        color: "rgba(240,232,224,0.3)",
        fontSize: 14,
      }}>
        No night routine for today 🌙<br />
        <span style={{ fontSize: 12 }}>Rest your skin tonight!</span>
      </div>
    )}

    {currentSteps.map((step, i) => {
      const key = `${prefix}${step.id}`;
      const done = !!checked[key];
      return (
        <div
          key={key}
          onClick={() => toggle(key)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "16px",
            marginBottom: 10,
            borderRadius: 16,
            background: done
              ? "rgba(180,120,200,0.12)"
              : "rgba(255,255,255,0.03)",
            border: done
              ? "1px solid rgba(180,120,200,0.4)"
              : "1px solid rgba(255,255,255,0.06)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            opacity: done ? 1 : 0.8,
          }}
        >
          {/* Step number */}
          <div style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: done
              ? "linear-gradient(135deg, #7a3a9a, #b478c8)"
              : "rgba(255,255,255,0.06)",
            border: done ? "none" : "1px solid rgba(180,120,200,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: done ? 14 : 12,
            color: done ? "white" : "rgba(240,232,224,0.3)",
            flexShrink: 0,
            transition: "all 0.2s ease",
          }}>
            {done ? "✓" : i + 1}
          </div>

          {/* Product info */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 14,
              fontWeight: 500,
              color: done ? "#f0e8e0" : "rgba(240,232,224,0.7)",
              textDecoration: done ? "none" : "none",
              marginBottom: 2,
            }}>
              {step.name}
            </div>
            <div style={{
              fontSize: 11,
              color: done ? "#b478c8" : "rgba(240,232,224,0.3)",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}>
              {step.brand}
            </div>
          </div>

          {/* Tap hint */}
          {!done && (
            <div style={{ fontSize: 10, color: "rgba(240,232,224,0.2)", letterSpacing: 1 }}>
              TAP
            </div>
          )}
        </div>
      );
    })}

    {/* Completion message */}
    {currentSteps.length > 0 && currentSteps.every(s => checked[`${prefix}${s.id}`]) && (
      <div style={{
        textAlign: "center",
        padding: "24px",
        background: "rgba(180,120,200,0.08)",
        borderRadius: 16,
        border: "1px solid rgba(180,120,200,0.3)",
        marginTop: 8,
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>✨</div>
        <div style={{ fontSize: 16, color: "#b478c8", marginBottom: 4 }}>
          {activeTab === "morning" ? "Morning routine done!" : "Night routine done!"}
        </div>
        <div style={{ fontSize: 12, color: "rgba(240,232,224,0.4)" }}>
          Your skin thanks you 🌿
        </div>
      </div>
    )}
  </div>

  {/* Bottom tip */}
  <div style={{
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "12px 20px",
    background: "rgba(10,10,10,0.95)",
    borderTop: "1px solid rgba(180,120,200,0.15)",
    textAlign: "center",
    fontSize: 11,
    color: "rgba(240,232,224,0.3)",
    letterSpacing: 1,
  }}>
    💜 Give your routine 6–8 weeks to work its magic
  </div>
</div>
```

);
}
