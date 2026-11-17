import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────
const C = {
  primary:    "#FF6B00",
  primaryDark:"#FF3D00",
  bg:         "#0D1117",
  card:       "#161B22",
  cardAlt:    "#1F2937",
  border:     "rgba(255,255,255,0.07)",
  textPrimary:"#F0F6FC",
  textMuted:  "#8B949E",
  success:    "#10B981",
  warning:    "#F59E0B",
  purple:     "#8B5CF6",
  blue:       "#3B82F6",
  pink:       "#EC4899",
  teal:       "#06B6D4",
};

// ─────────────────────────────────────────────────────────────
// REUSABLE PRIMITIVES
// ─────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = "primary", className = "", disabled = false }) => {
  const styles = {
    primary: { background: `linear-gradient(135deg,${C.primary},${C.primaryDark})`, color: "#fff" },
    outline: { background: "transparent", color: C.primary, border: `1.5px solid ${C.primary}` },
    ghost:   { background: C.card, color: C.textPrimary, border: `1px solid ${C.border}` },
    danger:  { background: "rgba(239,68,68,0.15)", color: "#EF4444" },
    success: { background: C.success, color: "#fff" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl font-bold transition-all duration-200 ${className}`}
      style={{ ...styles[variant], opacity: disabled ? 0.5 : 1 }}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "", style = {} }) => (
  <div
    className={`rounded-2xl ${className}`}
    style={{ background: C.card, border: `1px solid ${C.border}`, ...style }}
  >
    {children}
  </div>
);

const Input = ({ label, type = "text", value, onChange, placeholder, icon, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-xs font-semibold" style={{ color: C.textMuted }}>{label}</label>}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full py-3 rounded-2xl text-sm outline-none transition-all"
        style={{
          background: C.cardAlt,
          border: `1px solid ${C.border}`,
          color: C.textPrimary,
          paddingLeft: icon ? "2.5rem" : "1rem",
          paddingRight: "1rem",
        }}
      />
    </div>
  </div>
);

const SectionHeader = ({ title, action, onAction }) => (
  <div className="flex items-center justify-between px-4 mb-3">
    <h2 className="font-black text-lg" style={{ color: C.textPrimary }}>{title}</h2>
    {action && (
      <button className="text-xs font-semibold" style={{ color: C.primary }} onClick={onAction}>
        {action}
      </button>
    )}
  </div>
);

const PillTag = ({ text, color = C.primary }) => (
  <span
    className="text-xs font-bold px-2.5 py-0.5 rounded-full"
    style={{ background: `${color}22`, color }}
  >
    {text}
  </span>
);

const ProgressBar = ({ value, max = 100, color = C.primary }) => (
  <div className="w-full rounded-full h-1.5" style={{ background: C.cardAlt }}>
    <div
      className="h-1.5 rounded-full transition-all duration-700"
      style={{ width: `${(value / max) * 100}%`, background: color }}
    />
  </div>
);

const Toggle = ({ on, onToggle, label }) => (
  <div className="flex items-center justify-between">
    {label && <span className="text-sm font-semibold" style={{ color: C.textPrimary }}>{label}</span>}
    <button
      onClick={onToggle}
      className="relative w-12 h-6 rounded-full transition-all duration-300"
      style={{ background: on ? C.primary : C.cardAlt }}
    >
      <span
        className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow"
        style={{ left: on ? "calc(100% - 1.25rem)" : "0.25rem" }}
      />
    </button>
  </div>
);

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const MEAL_PLANS = [
  {
    id: 1, name: "Student Saver", emoji: "🎓", price: 799, duration: "Monthly",
    meals: 30, perMeal: 26.6, color: C.primary,
    perks: ["1 meal/day", "Lunch only", "Hostel delivery", "Cancel anytime"],
    popular: false,
  },
  {
    id: 2, name: "Hostel Combo", emoji: "🏠", price: 1399, duration: "Monthly",
    meals: 60, perMeal: 23.3, color: C.purple,
    perks: ["2 meals/day", "Breakfast + Lunch", "Room delivery", "Free snack Fridays"],
    popular: true,
  },
  {
    id: 3, name: "Gym Warrior", emoji: "💪", price: 2199, duration: "Monthly",
    meals: 90, perMeal: 24.4, color: C.success,
    perks: ["3 meals/day", "High protein", "Custom macros", "Nutrition tracking"],
    popular: false,
  },
];

const NOTIFICATIONS = [
  { id: 1, type: "order",  icon: "🛵", title: "Order Delivered!", body: "Your Fish Curry from Maa Kitchen has arrived.", time: "2 min ago",  read: false },
  { id: 2, type: "offer",  icon: "🎟", title: "New Coupon: BIHU25",   body: "Get 25% off on all Assamese specials this Bihu!", time: "1 hr ago",  read: false },
  { id: 3, type: "order",  icon: "🍳", title: "Order Confirmed",       body: "Protein House has accepted your order #FX204.", time: "3 hr ago",  read: true  },
  { id: 4, type: "system", icon: "🚁", title: "FoodoraX Air Update",   body: "Drone delivery zones in Hostel A coming next month!", time: "1 day ago", read: true  },
  { id: 5, type: "offer",  icon: "💰", title: "Refer & Earn!",         body: "Your friend Priya used your code. ₹50 credited!", time: "2 days ago", read: true  },
  { id: 6, type: "order",  icon: "⭐", title: "Rate your order",       body: "How was your meal from Jagiroad Dhaba?", time: "3 days ago", read: true  },
];

const GROUP_ORDERS = [
  { id: "G001", creator: "Rahul B.", restaurant: "Maa Kitchen", members: 4, maxMembers: 8, total: 648, status: "open",   timeLeft: "12 min" },
  { id: "G002", creator: "Priya D.", restaurant: "Chai Adda",   members: 3, maxMembers: 6, total: 261, status: "open",   timeLeft: "5 min"  },
  { id: "G003", creator: "Amit S.",  restaurant: "Student Bites",members: 6, maxMembers: 6, total: 882, status: "closed", timeLeft: "—"      },
];

const COUPONS = [
  { code: "STUDENT10", desc: "10% off for students",       discount: "10%",  minOrder: 49,  expires: "31 May 2026", type: "percent", color: C.primary },
  { code: "FOODORAX",  desc: "₹30 flat off on any order",  discount: "₹30",  minOrder: 99,  expires: "30 Jun 2026", type: "flat",    color: C.purple  },
  { code: "BIHU25",    desc: "Bihu special – 25% off",     discount: "25%",  minOrder: 149, expires: "20 Apr 2026", type: "percent", color: C.success },
  { code: "FIRSTGYM",  desc: "First gym meal – ₹50 off",   discount: "₹50",  minOrder: 129, expires: "31 May 2026", type: "flat",    color: C.warning },
];

const FITNESS_MEALS = [
  { name: "Pre-Workout Bowl",    cal: 320, protein: 28, carbs: 38, fat: 6,  price: 129, emoji: "🥗", tag: "Pre-WO"   },
  { name: "Post-Workout Shake",  cal: 180, protein: 32, carbs: 18, fat: 2,  price: 89,  emoji: "🥤", tag: "Post-WO"  },
  { name: "Egg White Omelette",  cal: 180, protein: 22, carbs: 4,  fat: 3,  price: 79,  emoji: "🍳", tag: "Anytime"  },
  { name: "Grilled Chicken",     cal: 380, protein: 42, carbs: 8,  fat: 14, price: 159, emoji: "🍗", tag: "Bulk"     },
  { name: "Oats Power Bowl",     cal: 290, protein: 18, carbs: 44, fat: 5,  price: 99,  emoji: "🥣", tag: "Morning"  },
  { name: "Paneer Protein Wrap", cal: 420, protein: 26, carbs: 36, fat: 16, price: 119, emoji: "🌯", tag: "Veg Bulk" },
];

const ASSAMESE_DISHES = [
  { name: "Masor Tenga",      desc: "Light, tangy fish curry in tomato & lemon broth", price: 99,  emoji: "🐟", region: "Traditional", cal: 280 },
  { name: "Hanh'r Mangxo",   desc: "Slow-cooked duck in mustard & bamboo shoot gravy", price: 149, emoji: "🦆", region: "Festive",     cal: 520 },
  { name: "Khar",             desc: "Unique alkaline curry made with raw papaya",       price: 79,  emoji: "🫙", region: "Traditional", cal: 210 },
  { name: "Paro Mangxo",     desc: "Pigeon meat curry — a Bihu delicacy",              price: 169, emoji: "🕊️", region: "Festive",     cal: 440 },
  { name: "Xaak Bhaji",      desc: "Assorted leafy greens stir-fried with mustard",    price: 49,  emoji: "🥬", region: "Everyday",    cal: 90  },
  { name: "Jolpan Platter",  desc: "Poha, chira, curd, til pitha & jaggery",           price: 69,  emoji: "🥣", region: "Breakfast",   cal: 380 },
  { name: "Aloo Pitika",     desc: "Smashed potato with mustard oil & green chilli",   price: 39,  emoji: "🥔", region: "Everyday",    cal: 140 },
  { name: "Pitha Combo",     desc: "Til pitha + narikol pitha + ghila pitha (3 pcs)", price: 59,  emoji: "🫓", region: "Sweet",       cal: 320 },
  { name: "Poita Bhat",      desc: "Fermented rice — cooling & probiotic-rich",        price: 49,  emoji: "🍚", region: "Traditional", cal: 180 },
  { name: "Bihu Special Box",desc: "7-item Assamese feast — Fish, Duck, Khar & more", price: 299, emoji: "🎉", region: "Festival",    cal: 820 },
];

const HOSTEL_ADDRESSES = [
  { id: 1, label: "Hostel Block A", room: "Room 204", landmark: "Near Gate 1" },
  { id: 2, label: "Hostel Block B", room: "Room 118", landmark: "Ground Floor" },
  { id: 3, label: "Library Gate",   room: "",         landmark: "Main entrance" },
  { id: 4, label: "Canteen Steps",  room: "",         landmark: "College canteen" },
];

// ─────────────────────────────────────────────────────────────
// AUTH SCREEN
// ─────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode]       = useState("login"); // login | signup | otp | forgot
  const [phone, setPhone]     = useState("");
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [otp, setOtp]         = useState(["","","","","",""]);
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("student");
  const otpRefs = useRef([]);

  const handleOtpChange = (val, i) => {
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const simulate = (fn) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); fn(); }, 1200);
  };

  const handleSendOtp = () => simulate(() => setStep(2));
  const handleVerify  = () => simulate(() => onAuth({ name: name || "Rahul Bora", email, phone, userType }));
  const handleGoogle  = () => simulate(() => onAuth({ name: "Google User", email: "user@gmail.com", phone: "9876543210", userType: "student" }));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.bg }}>
      {/* Hero */}
      <div
        className="flex flex-col items-center justify-center pt-16 pb-10 px-6 relative overflow-hidden"
        style={{ background: `linear-gradient(160deg,#1a0800 0%,${C.bg} 70%)` }}
      >
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #FF6B00 0%, transparent 50%), radial-gradient(circle at 80% 20%, #FF3D00 0%, transparent 40%)" }} />
        <div className="text-7xl mb-4">🍔</div>
        <h1 className="font-black text-4xl tracking-tighter mb-1"
          style={{ background: `linear-gradient(135deg,${C.primary},${C.primaryDark})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          FoodoraX
        </h1>
        <p className="text-sm font-medium" style={{ color: C.textMuted }}>Jagiroad's own food delivery app</p>
        <div className="flex gap-4 mt-5 text-xs" style={{ color: C.textMuted }}>
          {["🎓 Student combos", "🍚 Assamese food", "💪 Gym meals"].map(t => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-6">
        {step === 1 ? (
          <>
            {/* Mode toggle */}
            <div className="flex rounded-2xl p-1 mb-6" style={{ background: C.card }}>
              {["login","signup"].map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className="flex-1 py-2 rounded-xl text-sm font-bold capitalize transition-all"
                  style={{ background: mode === m ? C.primary : "transparent", color: mode === m ? "#fff" : C.textMuted }}>
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            {mode === "signup" && (
              <>
                <Input label="Full Name" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Rahul Bora" icon="👤" className="mb-3" />
                {/* User type */}
                <div className="mb-3">
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: C.textMuted }}>I am a…</label>
                  <div className="flex gap-2">
                    {[["student","🎓","Student"],["hostel","🏠","Hostel"],["gym","💪","Gym User"],["regular","👤","Regular"]].map(([val,em,lbl]) => (
                      <button key={val} onClick={() => setUserType(val)}
                        className="flex-1 flex flex-col items-center py-2 rounded-xl text-xs font-bold transition-all"
                        style={{
                          background: userType === val ? `${C.primary}22` : C.cardAlt,
                          border: `1.5px solid ${userType === val ? C.primary : C.border}`,
                          color: userType === val ? C.primary : C.textMuted,
                        }}>
                        <span className="text-lg">{em}</span>
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
                <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@college.edu" icon="✉️" className="mb-3" />
              </>
            )}

            <Input label="Phone Number" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+91 98765 43210" icon="📱" className="mb-4" />

            <Btn onClick={handleSendOtp} className="w-full py-3.5 text-base" disabled={loading || !phone}>
              {loading ? "Sending OTP…" : `Get OTP →`}
            </Btn>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: C.border }} />
              <span className="text-xs" style={{ color: C.textMuted }}>or continue with</span>
              <div className="flex-1 h-px" style={{ background: C.border }} />
            </div>

            <Btn variant="ghost" onClick={handleGoogle} className="w-full py-3.5 text-sm">
              {loading ? "…" : "🔵  Continue with Google"}
            </Btn>

            {mode === "login" && (
              <button className="w-full text-center text-xs mt-4 font-semibold" style={{ color: C.textMuted }}
                onClick={() => setMode("forgot")}>
                Forgot password?
              </button>
            )}
          </>
        ) : (
          /* OTP Step */
          <>
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">📱</div>
              <h2 className="font-black text-xl" style={{ color: C.textPrimary }}>Enter OTP</h2>
              <p className="text-sm mt-1" style={{ color: C.textMuted }}>
                Sent to <span style={{ color: C.primary }}>{phone || "+91 98765 43210"}</span>
              </p>
            </div>
            <div className="flex justify-center gap-3 mb-8">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={el => otpRefs.current[i] = el}
                  type="number"
                  maxLength={1}
                  value={d}
                  onChange={e => handleOtpChange(e.target.value, i)}
                  className="w-12 h-14 rounded-2xl text-center text-xl font-black outline-none"
                  style={{
                    background: d ? `${C.primary}22` : C.cardAlt,
                    border: `2px solid ${d ? C.primary : C.border}`,
                    color: C.textPrimary,
                  }}
                />
              ))}
            </div>
            <Btn onClick={handleVerify} className="w-full py-3.5 text-base" disabled={loading || otp.join("").length < 6}>
              {loading ? "Verifying…" : "Verify & Continue →"}
            </Btn>
            <button className="w-full text-center text-xs mt-4" style={{ color: C.textMuted }}
              onClick={() => setStep(1)}>
              ← Change number
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// NOTIFICATIONS PAGE
// ─────────────────────────────────────────────────────────────
function NotificationsPage({ onBack }) {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const unread = notifs.filter(n => !n.read).length;

  const markAll = () => setNotifs(p => p.map(n => ({ ...n, read: true })));
  const markOne = (id) => setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n));

  const typeColor = { order: C.primary, offer: C.success, system: C.purple };

  return (
    <div className="min-h-screen pb-24" style={{ background: C.bg, color: C.textPrimary }}>
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 py-4 flex items-center gap-3"
        style={{ background: "rgba(13,17,23,0.97)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>
        <button onClick={onBack} className="text-2xl w-9 h-9 flex items-center justify-center rounded-xl"
          style={{ background: C.card }}>←</button>
        <div className="flex-1">
          <h1 className="font-black text-xl">Notifications</h1>
          {unread > 0 && <p className="text-xs" style={{ color: C.primary }}>{unread} unread</p>}
        </div>
        {unread > 0 && (
          <Btn variant="ghost" onClick={markAll} className="text-xs px-3 py-1.5">Mark all read</Btn>
        )}
      </div>

      <div className="px-4 pt-4 flex flex-col gap-2">
        {notifs.map(n => (
          <button key={n.id} onClick={() => markOne(n.id)}
            className="flex gap-3 p-3 rounded-2xl text-left w-full transition-all"
            style={{
              background: n.read ? C.card : `${typeColor[n.type]}11`,
              border: `1px solid ${n.read ? C.border : `${typeColor[n.type]}33`}`,
            }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${typeColor[n.type]}22` }}>
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm truncate">{n.title}</span>
                {!n.read && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: typeColor[n.type] }} />}
              </div>
              <p className="text-xs mt-0.5 line-clamp-2" style={{ color: C.textMuted }}>{n.body}</p>
              <span className="text-xs mt-1 block" style={{ color: C.textMuted }}>{n.time}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COUPONS PAGE
// ─────────────────────────────────────────────────────────────
function CouponsPage({ onBack }) {
  const [copied, setCopied] = useState(null);

  const copy = (code) => {
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: C.bg, color: C.textPrimary }}>
      <div className="sticky top-0 z-40 px-4 py-4 flex items-center gap-3"
        style={{ background: "rgba(13,17,23,0.97)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>
        <button onClick={onBack} className="text-2xl w-9 h-9 flex items-center justify-center rounded-xl"
          style={{ background: C.card }}>←</button>
        <h1 className="font-black text-xl">Coupons & Offers 🎟</h1>
      </div>

      {/* Enter coupon */}
      <div className="px-4 pt-4 mb-5">
        <Card className="p-4">
          <p className="text-sm font-bold mb-3" style={{ color: C.textPrimary }}>Have a code?</p>
          <div className="flex gap-2">
            <input placeholder="Enter coupon code"
              className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
              style={{ background: C.cardAlt, border: `1px solid ${C.border}`, color: C.textPrimary }} />
            <Btn className="px-4 py-3 text-sm">Apply</Btn>
          </div>
        </Card>
      </div>

      <SectionHeader title="Available Coupons" />
      <div className="px-4 flex flex-col gap-3">
        {COUPONS.map(c => (
          <div key={c.code} className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${c.color}33` }}>
            {/* Top bar */}
            <div className="px-4 py-2 flex items-center justify-between"
              style={{ background: `${c.color}18` }}>
              <div>
                <span className="font-black text-lg tracking-widest" style={{ color: c.color }}>{c.code}</span>
                <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: c.color }}>{c.discount} OFF</span>
              </div>
              <Btn variant="ghost" onClick={() => copy(c.code)}
                className="text-xs px-3 py-1.5">
                {copied === c.code ? "✓ Copied!" : "Copy"}
              </Btn>
            </div>
            {/* Details */}
            <div className="px-4 py-3" style={{ background: C.card }}>
              <p className="text-sm font-semibold" style={{ color: C.textPrimary }}>{c.desc}</p>
              <div className="flex items-center gap-4 mt-1.5">
                <span className="text-xs" style={{ color: C.textMuted }}>Min order: ₹{c.minOrder}</span>
                <span className="text-xs" style={{ color: C.textMuted }}>Expires: {c.expires}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MEAL SUBSCRIPTION PAGE
// ─────────────────────────────────────────────────────────────
function SubscriptionPage({ onBack }) {
  const [selected, setSelected]   = useState(2);
  const [duration, setDuration]   = useState("monthly");
  const [confirmed, setConfirmed] = useState(false);

  const plan = MEAL_PLANS.find(p => p.id === selected);

  if (confirmed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: C.bg }}>
        <div className="text-8xl mb-4">🎉</div>
        <h2 className="font-black text-3xl text-center mb-2" style={{ color: C.textPrimary }}>Subscribed!</h2>
        <p className="text-center text-sm mb-1" style={{ color: C.textMuted }}>
          Your <span style={{ color: plan.color }}>{plan.name}</span> plan is active.
        </p>
        <p className="text-center text-sm mb-8" style={{ color: C.textMuted }}>
          First meal delivery starts tomorrow morning 🌅
        </p>
        <Btn onClick={() => setConfirmed(false)} className="px-8 py-3 text-base" variant="outline">
          Manage Plan
        </Btn>
        <button onClick={onBack} className="mt-4 text-sm" style={{ color: C.textMuted }}>← Back to profile</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32" style={{ background: C.bg, color: C.textPrimary }}>
      <div className="sticky top-0 z-40 px-4 py-4 flex items-center gap-3"
        style={{ background: "rgba(13,17,23,0.97)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>
        <button onClick={onBack} className="text-2xl w-9 h-9 flex items-center justify-center rounded-xl"
          style={{ background: C.card }}>←</button>
        <div>
          <h1 className="font-black text-xl">Meal Subscriptions 🍱</h1>
          <p className="text-xs" style={{ color: C.textMuted }}>Save up to 45% vs ordering daily</p>
        </div>
      </div>

      {/* Duration toggle */}
      <div className="px-4 pt-4 mb-5">
        <div className="flex rounded-2xl p-1" style={{ background: C.card }}>
          {["weekly","monthly"].map(d => (
            <button key={d} onClick={() => setDuration(d)}
              className="flex-1 py-2 rounded-xl text-sm font-bold capitalize"
              style={{ background: duration === d ? C.primary : "transparent", color: duration === d ? "#fff" : C.textMuted }}>
              {d === "weekly" ? "Weekly" : "Monthly (Best Value)"}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="px-4 flex flex-col gap-4 mb-6">
        {MEAL_PLANS.map(plan => (
          <button key={plan.id} onClick={() => setSelected(plan.id)}
            className="relative rounded-2xl text-left overflow-hidden transition-all duration-200"
            style={{
              border: `2px solid ${selected === plan.id ? plan.color : C.border}`,
              transform: selected === plan.id ? "scale(1.01)" : "scale(1)",
            }}>
            {plan.popular && (
              <div className="absolute top-3 right-3 text-xs font-black px-2.5 py-1 rounded-full text-white"
                style={{ background: plan.color }}>
                🔥 POPULAR
              </div>
            )}
            <div className="p-4" style={{ background: selected === plan.id ? `${plan.color}12` : C.card }}>
              <div className="flex items-start gap-3">
                <span className="text-4xl">{plan.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-black text-lg" style={{ color: plan.color }}>{plan.name}</h3>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="font-black text-3xl" style={{ color: C.textPrimary }}>
                      ₹{duration === "weekly" ? Math.floor(plan.price / 4) : plan.price}
                    </span>
                    <span className="text-sm" style={{ color: C.textMuted }}>/{duration}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                    ≈ ₹{duration === "weekly"
                      ? Math.floor(plan.price / 4 / (plan.meals / 4))
                      : Math.floor(plan.perMeal)}/meal
                  </p>
                </div>
              </div>
              {/* Perks */}
              <div className="mt-3 flex flex-col gap-1.5">
                {plan.perks.map(p => (
                  <div key={p} className="flex items-center gap-2 text-xs" style={{ color: C.textMuted }}>
                    <span style={{ color: plan.color }}>✓</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
              {/* Meals bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1" style={{ color: C.textMuted }}>
                  <span>Meals included</span>
                  <span style={{ color: plan.color }}>{duration === "weekly" ? Math.floor(plan.meals / 4) : plan.meals}</span>
                </div>
                <ProgressBar value={plan.meals} max={90} color={plan.color} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 max-w-md mx-auto"
        style={{ background: "rgba(13,17,23,0.97)", borderTop: `1px solid ${C.border}` }}>
        <Btn onClick={() => setConfirmed(true)} className="w-full py-4 text-base">
          Subscribe to {plan?.name} — ₹{duration === "weekly" ? Math.floor(plan.price / 4) : plan.price}/{duration}
        </Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// GROUP ORDERS PAGE
// ─────────────────────────────────────────────────────────────
function GroupOrderPage({ onBack }) {
  const [groups, setGroups] = useState(GROUP_ORDERS);
  const [creating, setCreating] = useState(false);
  const [newGroup, setNewGroup] = useState({ restaurant: "", maxMembers: 4 });
  const [joined, setJoined] = useState(null);

  const joinGroup = (id) => {
    setGroups(p => p.map(g => g.id === id && g.members < g.maxMembers
      ? { ...g, members: g.members + 1, total: g.total + 147 }
      : g));
    setJoined(id);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: C.bg, color: C.textPrimary }}>
      <div className="sticky top-0 z-40 px-4 py-4 flex items-center gap-3"
        style={{ background: "rgba(13,17,23,0.97)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>
        <button onClick={onBack} className="text-2xl w-9 h-9 flex items-center justify-center rounded-xl"
          style={{ background: C.card }}>←</button>
        <div className="flex-1">
          <h1 className="font-black text-xl">Group Orders 👥</h1>
          <p className="text-xs" style={{ color: C.textMuted }}>Order together, save on delivery</p>
        </div>
        <Btn onClick={() => setCreating(!creating)} className="text-xs px-3 py-1.5">
          {creating ? "Cancel" : "+ Create"}
        </Btn>
      </div>

      {/* Create group form */}
      {creating && (
        <div className="px-4 py-4">
          <Card className="p-4">
            <h3 className="font-bold text-sm mb-3" style={{ color: C.textPrimary }}>Start a group order</h3>
            <Input label="Restaurant name" value={newGroup.restaurant}
              onChange={e => setNewGroup(p => ({ ...p, restaurant: e.target.value }))}
              placeholder="e.g. Maa Kitchen" className="mb-3" />
            <div className="mb-3">
              <label className="text-xs font-semibold block mb-1.5" style={{ color: C.textMuted }}>Max members</label>
              <div className="flex gap-2">
                {[2,4,6,8,10].map(n => (
                  <button key={n} onClick={() => setNewGroup(p => ({ ...p, maxMembers: n }))}
                    className="flex-1 py-2 rounded-xl text-sm font-bold"
                    style={{
                      background: newGroup.maxMembers === n ? C.primary : C.cardAlt,
                      color: newGroup.maxMembers === n ? "#fff" : C.textMuted,
                    }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <Btn className="w-full py-3 text-sm" onClick={() => {
              setGroups(p => [{
                id: `G00${p.length + 1}`, creator: "You",
                restaurant: newGroup.restaurant || "Maa Kitchen",
                members: 1, maxMembers: newGroup.maxMembers,
                total: 0, status: "open", timeLeft: "20 min"
              }, ...p]);
              setCreating(false);
            }}>
              Create Group Order
            </Btn>
          </Card>
        </div>
      )}

      {/* Info strip */}
      <div className="mx-4 my-4 p-3 rounded-2xl flex items-center gap-3"
        style={{ background: `${C.primary}15`, border: `1px solid ${C.primary}33` }}>
        <span className="text-2xl">💡</span>
        <p className="text-xs" style={{ color: C.textMuted }}>
          Join a group order from your hostel & get <span style={{ color: C.primary }}>free delivery</span> when the group reaches ₹299+
        </p>
      </div>

      {/* Group list */}
      <div className="px-4 flex flex-col gap-3">
        {groups.map(g => {
          const isFull    = g.members >= g.maxMembers;
          const isOpen    = g.status === "open";
          const didJoin   = joined === g.id;
          const fillPct   = (g.members / g.maxMembers) * 100;
          return (
            <Card key={g.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-black text-base" style={{ color: C.textPrimary }}>{g.restaurant}</div>
                  <div className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                    Started by <span style={{ color: C.primary }}>{g.creator}</span>
                  </div>
                </div>
                <PillTag
                  text={isFull ? "Full" : isOpen ? `⏱ ${g.timeLeft}` : "Closed"}
                  color={isFull ? "#EF4444" : isOpen ? C.success : C.textMuted}
                />
              </div>

              {/* Members progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5" style={{ color: C.textMuted }}>
                  <span>{g.members} / {g.maxMembers} members</span>
                  <span>Total: ₹{g.total}</span>
                </div>
                <ProgressBar value={fillPct} color={isFull ? "#EF4444" : C.success} />
                {/* Avatars */}
                <div className="flex mt-2 gap-1">
                  {Array.from({ length: g.members }).map((_, i) => (
                    <div key={i}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white border-2"
                      style={{
                        background: [C.primary, C.purple, C.success, C.warning, C.pink, C.teal][i % 6],
                        borderColor: C.bg,
                      }}>
                      {["R","P","A","B","S","M"][i]}
                    </div>
                  ))}
                  {!isFull && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2"
                      style={{ borderColor: C.border, borderStyle: "dashed", color: C.textMuted }}>
                      +
                    </div>
                  )}
                </div>
              </div>

              {isOpen && !isFull && (
                <Btn
                  onClick={() => joinGroup(g.id)}
                  className="w-full py-2.5 text-sm"
                  variant={didJoin ? "success" : "primary"}
                  disabled={didJoin}
                >
                  {didJoin ? "✓ Joined! Add your items →" : "Join Group Order"}
                </Btn>
              )}
              {(isFull || !isOpen) && (
                <div className="py-2.5 rounded-xl text-center text-sm font-bold"
                  style={{ background: C.cardAlt, color: C.textMuted }}>
                  {isFull ? "Group is full" : "Order closed"}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FITNESS PAGE
// ─────────────────────────────────────────────────────────────
function FitnessPage({ onBack, setCart }) {
  const [goal, setGoal]   = useState("bulk"); // bulk | cut | maintain
  const [cart2, setCart2] = useState({});

  const goals = [
    { id: "bulk",     label: "Bulk Up",    emoji: "📈", cal: "2800+", protein: "160g+" },
    { id: "cut",      label: "Cut Fat",    emoji: "📉", cal: "1800",  protein: "140g+" },
    { id: "maintain", label: "Maintain",   emoji: "⚖️",  cal: "2200",  protein: "120g+" },
  ];
  const goalColors = { bulk: C.purple, cut: "#EF4444", maintain: C.success };
  const gc = goalColors[goal];

  const addItem = (item) => {
    setCart2(p => ({ ...p, [item.name]: (p[item.name] || 0) + 1 }));
    setCart(prev => {
      const ex = prev.find(c => c.name === item.name);
      if (ex) return prev.map(c => c.name === item.name ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: 300 + Math.random(), name: item.name, price: item.price, qty: 1, emoji: item.emoji, restaurantId: 2 }];
    });
  };

  const totalCal     = Object.entries(cart2).reduce((s, [name, qty]) => s + (FITNESS_MEALS.find(m => m.name === name)?.cal || 0) * qty, 0);
  const totalProtein = Object.entries(cart2).reduce((s, [name, qty]) => s + (FITNESS_MEALS.find(m => m.name === name)?.protein || 0) * qty, 0);

  return (
    <div className="min-h-screen pb-28" style={{ background: C.bg, color: C.textPrimary }}>
      <div className="sticky top-0 z-40 px-4 py-4 flex items-center gap-3"
        style={{ background: "rgba(13,17,23,0.97)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>
        <button onClick={onBack} className="text-2xl w-9 h-9 flex items-center justify-center rounded-xl"
          style={{ background: C.card }}>←</button>
        <div>
          <h1 className="font-black text-xl">💪 Fitness Meals</h1>
          <p className="text-xs" style={{ color: C.textMuted }}>Macro-tracked meals for your goal</p>
        </div>
      </div>

      {/* Goal selector */}
      <div className="px-4 pt-4 mb-5">
        <p className="text-xs font-semibold mb-2" style={{ color: C.textMuted }}>SELECT YOUR GOAL</p>
        <div className="flex gap-2">
          {goals.map(g => (
            <button key={g.id} onClick={() => setGoal(g.id)}
              className="flex-1 flex flex-col items-center py-3 rounded-2xl transition-all"
              style={{
                background: goal === g.id ? `${goalColors[g.id]}22` : C.card,
                border: `1.5px solid ${goal === g.id ? goalColors[g.id] : C.border}`,
              }}>
              <span className="text-2xl mb-1">{g.emoji}</span>
              <span className="text-xs font-bold" style={{ color: goal === g.id ? goalColors[g.id] : C.textMuted }}>{g.label}</span>
              <span className="text-xs mt-0.5" style={{ color: C.textMuted }}>{g.cal} kcal</span>
            </button>
          ))}
        </div>
      </div>

      {/* Macro tracker */}
      {Object.keys(cart2).length > 0 && (
        <div className="mx-4 mb-5 p-4 rounded-2xl" style={{ background: `${gc}18`, border: `1px solid ${gc}33` }}>
          <p className="text-xs font-bold mb-3" style={{ color: gc }}>📊 TODAY'S MEAL TRACKER</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: C.textMuted }}>
                <span>Calories</span>
                <span style={{ color: gc }}>{totalCal} / {goals.find(g2 => g2.id === goal)?.cal.replace("+","")}</span>
              </div>
              <ProgressBar value={totalCal} max={parseInt(goals.find(g2 => g2.id === goal)?.cal || "2200")} color={gc} />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: C.textMuted }}>
                <span>Protein</span>
                <span style={{ color: gc }}>{totalProtein}g / {goals.find(g2 => g2.id === goal)?.protein.replace("+","")}</span>
              </div>
              <ProgressBar value={totalProtein} max={parseInt(goals.find(g2 => g2.id === goal)?.protein || "120")} color={gc} />
            </div>
          </div>
        </div>
      )}

      {/* Meals grid */}
      <SectionHeader title="Gym Meals Menu" />
      <div className="px-4 flex flex-col gap-3">
        {FITNESS_MEALS.map((meal, i) => {
          const qty = cart2[meal.name] || 0;
          return (
            <Card key={i} className="p-3">
              <div className="flex gap-3">
                <div className="text-5xl flex-shrink-0">{meal.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm" style={{ color: C.textPrimary }}>{meal.name}</span>
                    <PillTag text={meal.tag} color={gc} />
                  </div>
                  {/* Macros bars */}
                  <div className="mt-2 flex flex-col gap-1.5">
                    {[
                      { label: "Protein", val: meal.protein, max: 50,  color: C.purple },
                      { label: "Carbs",   val: meal.carbs,   max: 80,  color: C.warning },
                      { label: "Fat",     val: meal.fat,     max: 30,  color: "#EF4444"  },
                    ].map(macro => (
                      <div key={macro.label} className="flex items-center gap-2">
                        <span className="text-xs w-12 flex-shrink-0" style={{ color: C.textMuted }}>{macro.label}</span>
                        <div className="flex-1">
                          <ProgressBar value={macro.val} max={macro.max} color={macro.color} />
                        </div>
                        <span className="text-xs w-8 text-right flex-shrink-0" style={{ color: macro.color }}>
                          {macro.val}g
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span className="font-black text-base" style={{ color: C.primary }}>₹{meal.price}</span>
                      <span className="text-xs ml-2" style={{ color: C.textMuted }}>{meal.cal} kcal</span>
                    </div>
                    {qty === 0 ? (
                      <Btn onClick={() => addItem(meal)} className="text-sm px-4 py-1.5">+ Add</Btn>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button onClick={() => setCart2(p => ({ ...p, [meal.name]: Math.max(0, p[meal.name] - 1) }))}
                          className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white"
                          style={{ background: C.cardAlt }}>−</button>
                        <span className="font-bold w-5 text-center" style={{ color: C.textPrimary }}>{qty}</span>
                        <button onClick={() => addItem(meal)}
                          className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white"
                          style={{ background: C.primary }}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ASSAMESE FOOD PAGE
// ─────────────────────────────────────────────────────────────
function AssamesePage({ onBack, setCart }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Traditional", "Festive", "Everyday", "Breakfast", "Sweet", "Festival"];
  const [cart2, setCart2] = useState({});

  const addItem = (item) => {
    setCart2(p => ({ ...p, [item.name]: (p[item.name] || 0) + 1 }));
    setCart(prev => {
      const ex = prev.find(c => c.name === item.name);
      if (ex) return prev.map(c => c.name === item.name ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: 400 + Math.random(), name: item.name, price: item.price, qty: 1, emoji: item.emoji, restaurantId: 1 }];
    });
  };

  const filtered = filter === "All" ? ASSAMESE_DISHES : ASSAMESE_DISHES.filter(d => d.region === filter);

  return (
    <div className="min-h-screen pb-24" style={{ background: C.bg, color: C.textPrimary }}>
      {/* Hero */}
      <div className="relative overflow-hidden px-4 pt-12 pb-8 text-center mb-2"
        style={{ background: "linear-gradient(160deg,#0d2b1a 0%, #0D1117 100%)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #10B981 0%, transparent 60%)" }} />
        <button onClick={onBack}
          className="absolute top-4 left-4 text-xl w-9 h-9 flex items-center justify-center rounded-xl"
          style={{ background: "rgba(0,0,0,0.4)" }}>←</button>
        <div className="text-6xl mb-3">🍚</div>
        <h1 className="font-black text-3xl mb-1" style={{ color: C.textPrimary }}>Assamese Specials</h1>
        <p className="text-sm" style={{ color: C.textMuted }}>Authentic flavours from the heart of Assam</p>
        <div className="flex gap-2 mt-4 justify-center flex-wrap">
          {["🐟 Fresh Fish","🦆 Duck Curry","🫙 Khar","🎉 Bihu Feast"].map(t => (
            <PillTag key={t} text={t} color={C.success} />
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 transition-all"
            style={{
              background: filter === f ? C.success : C.card,
              color: filter === f ? "white" : C.textMuted,
              border: `1px solid ${filter === f ? C.success : C.border}`,
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Dishes */}
      <div className="px-4 flex flex-col gap-3 pt-2">
        {filtered.map((dish, i) => {
          const qty = cart2[dish.name] || 0;
          const isBig = dish.name === "Bihu Special Box";
          return (
            <div key={i}
              className="rounded-2xl overflow-hidden"
              style={{
                background: isBig ? `linear-gradient(135deg,#1a0d0d,#2d1010)` : C.card,
                border: `1px solid ${isBig ? "#EF444433" : C.border}`,
              }}>
              {isBig && (
                <div className="px-4 py-2 flex items-center gap-2"
                  style={{ background: "rgba(239,68,68,0.15)" }}>
                  <span className="text-xs font-black" style={{ color: "#EF4444" }}>🎉 BIHU FESTIVAL SPECIAL</span>
                </div>
              )}
              <div className="flex gap-3 p-3">
                <span className="text-5xl flex-shrink-0">{dish.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm" style={{ color: C.textPrimary }}>{dish.name}</span>
                    <PillTag text={dish.region} color={C.success} />
                  </div>
                  <p className="text-xs mt-0.5 line-clamp-2" style={{ color: C.textMuted }}>{dish.desc}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs" style={{ color: C.textMuted }}>🔥 {dish.cal} kcal</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-black text-base" style={{ color: C.primary }}>₹{dish.price}</span>
                    {qty === 0 ? (
                      <Btn onClick={() => addItem(dish)} className="text-sm px-4 py-1.5">+ Add</Btn>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button onClick={() => setCart2(p => ({ ...p, [dish.name]: Math.max(0, p[dish.name] - 1) }))}
                          className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white"
                          style={{ background: C.cardAlt }}>−</button>
                        <span className="font-bold w-5 text-center" style={{ color: C.textPrimary }}>{qty}</span>
                        <button onClick={() => addItem(dish)}
                          className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white"
                          style={{ background: C.primary }}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ADDRESS MANAGER
// ─────────────────────────────────────────────────────────────
function AddressPage({ onBack }) {
  const [addresses, setAddresses] = useState(HOSTEL_ADDRESSES);
  const [adding, setAdding]       = useState(false);
  const [newAddr, setNewAddr]     = useState({ label: "", room: "", landmark: "" });
  const [defaultId, setDefaultId] = useState(1);

  return (
    <div className="min-h-screen pb-24" style={{ background: C.bg, color: C.textPrimary }}>
      <div className="sticky top-0 z-40 px-4 py-4 flex items-center gap-3"
        style={{ background: "rgba(13,17,23,0.97)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>
        <button onClick={onBack} className="text-2xl w-9 h-9 flex items-center justify-center rounded-xl"
          style={{ background: C.card }}>←</button>
        <h1 className="font-black text-xl">Saved Addresses 📍</h1>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-3">
        {addresses.map(addr => (
          <Card key={addr.id} className="p-3"
            style={{ border: defaultId === addr.id ? `1.5px solid ${C.primary}` : `1px solid ${C.border}` }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: `${C.primary}22` }}>
                {addr.label.includes("Hostel") ? "🏠" : addr.label.includes("Library") ? "📚" : "🍽️"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm" style={{ color: C.textPrimary }}>{addr.label}</span>
                  {defaultId === addr.id && <PillTag text="Default" color={C.primary} />}
                </div>
                {addr.room && <p className="text-xs" style={{ color: C.textMuted }}>{addr.room}</p>}
                {addr.landmark && <p className="text-xs" style={{ color: C.textMuted }}>{addr.landmark}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <button className="text-xs" style={{ color: C.primary }} onClick={() => setDefaultId(addr.id)}>
                  {defaultId === addr.id ? "✓ Default" : "Set default"}
                </button>
                <button className="text-xs" style={{ color: "#EF4444" }}
                  onClick={() => setAddresses(p => p.filter(a => a.id !== addr.id))}>
                  Remove
                </button>
              </div>
            </div>
          </Card>
        ))}

        {/* Add new */}
        {adding ? (
          <Card className="p-4">
            <h3 className="font-bold text-sm mb-3" style={{ color: C.textPrimary }}>New Address</h3>
            <Input label="Label" value={newAddr.label} onChange={e => setNewAddr(p => ({ ...p, label: e.target.value }))}
              placeholder="e.g. Hostel Block C" className="mb-3" />
            <Input label="Room number (optional)" value={newAddr.room} onChange={e => setNewAddr(p => ({ ...p, room: e.target.value }))}
              placeholder="Room 301" className="mb-3" />
            <Input label="Landmark" value={newAddr.landmark} onChange={e => setNewAddr(p => ({ ...p, landmark: e.target.value }))}
              placeholder="Near water tank" className="mb-4" />
            <div className="flex gap-2">
              <Btn onClick={() => {
                setAddresses(p => [...p, { id: Date.now(), ...newAddr }]);
                setAdding(false);
                setNewAddr({ label: "", room: "", landmark: "" });
              }} className="flex-1 py-2.5 text-sm">Save</Btn>
              <Btn variant="ghost" onClick={() => setAdding(false)} className="flex-1 py-2.5 text-sm">Cancel</Btn>
            </div>
          </Card>
        ) : (
          <Btn variant="outline" onClick={() => setAdding(true)} className="w-full py-3 text-sm">
            + Add New Address
          </Btn>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// REFERRAL PAGE
// ─────────────────────────────────────────────────────────────
function ReferralPage({ onBack }) {
  const [copied, setCopied] = useState(false);
  const code = "RAHUL50";
  const referrals = [
    { name: "Priya Devi",  date: "3 days ago",  reward: "₹50 earned",  status: "completed" },
    { name: "Amit Saikia", date: "1 week ago",   reward: "₹50 earned",  status: "completed" },
    { name: "Bikash Roy",  date: "Pending…",     reward: "₹50 pending", status: "pending"   },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: C.bg, color: C.textPrimary }}>
      <div className="sticky top-0 z-40 px-4 py-4 flex items-center gap-3"
        style={{ background: "rgba(13,17,23,0.97)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>
        <button onClick={onBack} className="text-2xl w-9 h-9 flex items-center justify-center rounded-xl"
          style={{ background: C.card }}>←</button>
        <h1 className="font-black text-xl">Refer & Earn 🎁</h1>
      </div>

      {/* Hero */}
      <div className="mx-4 mt-4 rounded-2xl p-6 text-center relative overflow-hidden mb-6"
        style={{ background: `linear-gradient(135deg,${C.primary},${C.primaryDark})` }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 50%)" }} />
        <div className="text-5xl mb-3">🎁</div>
        <h2 className="font-black text-2xl text-white mb-1">Earn ₹50 per Friend</h2>
        <p className="text-white/80 text-sm">Your friend also gets ₹30 on their first order</p>
      </div>

      {/* Code */}
      <div className="px-4 mb-6">
        <p className="text-xs font-semibold mb-2" style={{ color: C.textMuted }}>YOUR REFERRAL CODE</p>
        <div className="flex items-center gap-3 p-4 rounded-2xl"
          style={{ background: `${C.primary}15`, border: `2px dashed ${C.primary}55` }}>
          <span className="font-black text-3xl tracking-widest flex-1" style={{ color: C.primary }}>{code}</span>
          <Btn onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            variant="ghost" className="px-4 py-2 text-sm">
            {copied ? "✓ Copied!" : "Copy"}
          </Btn>
        </div>
        <div className="flex gap-2 mt-3">
          {["WhatsApp 💬","Instagram 📸","SMS 📱"].map(s => (
            <Btn key={s} variant="ghost" className="flex-1 py-2.5 text-xs">{s}</Btn>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-4 mb-6">
        {[
          { label: "Total Referred", value: "3" },
          { label: "Total Earned",   value: "₹100" },
          { label: "Pending",        value: "₹50" },
        ].map(s => (
          <Card key={s.label} className="p-3 text-center">
            <div className="font-black text-xl" style={{ color: C.textPrimary }}>{s.value}</div>
            <div className="text-xs" style={{ color: C.textMuted }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Referral history */}
      <SectionHeader title="Referral History" />
      <div className="px-4 flex flex-col gap-2">
        {referrals.map((r, i) => (
          <Card key={i} className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
              style={{ background: C.primary }}>{r.name[0]}</div>
            <div className="flex-1">
              <div className="font-bold text-sm" style={{ color: C.textPrimary }}>{r.name}</div>
              <div className="text-xs" style={{ color: C.textMuted }}>{r.date}</div>
            </div>
            <PillTag
              text={r.reward}
              color={r.status === "completed" ? C.success : C.warning}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SETTINGS PAGE
// ─────────────────────────────────────────────────────────────
function SettingsPage({ onBack }) {
  const [prefs, setPrefs] = useState({
    pushNotifs:    true,
    orderUpdates:  true,
    offerAlerts:   true,
    darkMode:      true,
    locationShare: true,
    newsletter:    false,
  });
  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  const sections = [
    {
      title: "Notifications",
      items: [
        { key: "pushNotifs",   label: "Push Notifications",  desc: "Order updates & alerts" },
        { key: "orderUpdates", label: "Order Status Alerts",  desc: "Track in real-time" },
        { key: "offerAlerts",  label: "Offers & Coupons",     desc: "Don't miss deals" },
      ],
    },
    {
      title: "Preferences",
      items: [
        { key: "darkMode",      label: "Dark Mode",           desc: "Easier on the eyes" },
        { key: "locationShare", label: "Share Location",       desc: "For accurate delivery" },
        { key: "newsletter",    label: "Weekly Newsletter",    desc: "New restaurants & offers" },
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: C.bg, color: C.textPrimary }}>
      <div className="sticky top-0 z-40 px-4 py-4 flex items-center gap-3"
        style={{ background: "rgba(13,17,23,0.97)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>
        <button onClick={onBack} className="text-2xl w-9 h-9 flex items-center justify-center rounded-xl"
          style={{ background: C.card }}>←</button>
        <h1 className="font-black text-xl">Settings ⚙️</h1>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-6">
        {sections.map(sec => (
          <div key={sec.title}>
            <p className="text-xs font-bold mb-2" style={{ color: C.textMuted }}>{sec.title.toUpperCase()}</p>
            <Card>
              {sec.items.map((item, i) => (
                <div key={item.key}
                  className={`flex items-center justify-between p-3 ${i < sec.items.length - 1 ? "border-b" : ""}`}
                  style={{ borderColor: C.border }}>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>{item.label}</div>
                    <div className="text-xs" style={{ color: C.textMuted }}>{item.desc}</div>
                  </div>
                  <Toggle on={prefs[item.key]} onToggle={() => toggle(item.key)} />
                </div>
              ))}
            </Card>
          </div>
        ))}

        {/* Account */}
        <div>
          <p className="text-xs font-bold mb-2" style={{ color: C.textMuted }}>ACCOUNT</p>
          <Card>
            {["Change Phone Number","Update Email","Delete Account"].map((item, i, arr) => (
              <button key={item}
                className={`w-full text-left p-3 text-sm font-semibold flex items-center justify-between ${i < arr.length - 1 ? "border-b" : ""}`}
                style={{
                  borderColor: C.border,
                  color: item === "Delete Account" ? "#EF4444" : C.textPrimary,
                }}>
                {item} <span style={{ color: C.textMuted }}>›</span>
              </button>
            ))}
          </Card>
        </div>

        <div className="text-center">
          <p className="text-xs" style={{ color: C.textMuted }}>FoodoraX v1.0.0 • Made with ❤️ in Assam</p>
          <p className="text-xs mt-1" style={{ color: C.textMuted }}>📍 Jagiroad, Assam, India</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN APP SHELL
// ─────────────────────────────────────────────────────────────
export default function FoodoraXExtended() {
  const [authed,  setAuthed]  = useState(false);
  const [user,    setUser]    = useState(null);
  const [subPage, setSubPage] = useState(null); // notifications|coupons|subscriptions|group|fitness|assamese|address|referral|settings
  const [cart,    setCart]    = useState([]);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const handleAuth = (u) => { setUser(u); setAuthed(true); };
  const back = () => setSubPage(null);

  if (!authed) return <AuthScreen onAuth={handleAuth} />;

  // Sub-pages
  if (subPage === "notifications")  return <NotificationsPage  onBack={back} />;
  if (subPage === "coupons")        return <CouponsPage        onBack={back} />;
  if (subPage === "subscriptions")  return <SubscriptionPage   onBack={back} />;
  if (subPage === "group")          return <GroupOrderPage     onBack={back} />;
  if (subPage === "fitness")        return <FitnessPage        onBack={back} setCart={setCart} />;
  if (subPage === "assamese")       return <AssamesePage       onBack={back} setCart={setCart} />;
  if (subPage === "address")        return <AddressPage        onBack={back} />;
  if (subPage === "referral")       return <ReferralPage       onBack={back} />;
  if (subPage === "settings")       return <SettingsPage       onBack={back} />;

  // ── Main dashboard / module launcher ──────────────────────
  const modules = [
    { id: "notifications", icon: "🔔", label: "Notifications",    badge: 2,      color: C.primary  },
    { id: "coupons",       icon: "🎟", label: "Coupons",           badge: 4,      color: C.success  },
    { id: "subscriptions", icon: "🍱", label: "Meal Plans",        badge: null,   color: C.purple   },
    { id: "group",         icon: "👥", label: "Group Orders",      badge: 2,      color: C.blue     },
    { id: "fitness",       icon: "💪", label: "Gym Meals",         badge: null,   color: "#8B5CF6"  },
    { id: "assamese",      icon: "🍚", label: "Assamese Food",     badge: "New",  color: C.success  },
    { id: "address",       icon: "📍", label: "My Addresses",      badge: null,   color: C.warning  },
    { id: "referral",      icon: "🎁", label: "Refer & Earn",      badge: "₹50",  color: C.pink     },
    { id: "settings",      icon: "⚙️", label: "Settings",          badge: null,   color: C.textMuted},
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: C.bg, color: C.textPrimary, maxWidth: 430, margin: "0 auto" }}>
      {/* Header */}
      <div className="px-4 pt-6 pb-4"
        style={{ background: `linear-gradient(160deg,#1a0800 0%,${C.bg} 100%)` }}>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-white"
            style={{ background: `linear-gradient(135deg,${C.primary},${C.primaryDark})` }}>
            {user?.name?.[0] || "R"}
          </div>
          <div>
            <div className="font-black text-2xl" style={{ color: C.textPrimary }}>
              Hey, {user?.name?.split(" ")[0]} 👋
            </div>
            <div className="text-sm" style={{ color: C.textMuted }}>{user?.email || "rahul@college.edu"}</div>
            <PillTag
              text={user?.userType === "student" ? "🎓 Student" : user?.userType === "gym" ? "💪 Gym" : "👤 Member"}
              color={C.primary}
            />
          </div>
        </div>

        {/* Wallet / Points strip */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "FX Points",  value: "1,240", icon: "⭐" },
            { label: "Wallet",     value: "₹150",  icon: "💳" },
            { label: "Savings",    value: "₹380",  icon: "💰" },
          ].map(s => (
            <Card key={s.label} className="p-3 text-center">
              <div className="text-xl mb-0.5">{s.icon}</div>
              <div className="font-black text-base" style={{ color: C.textPrimary }}>{s.value}</div>
              <div className="text-xs" style={{ color: C.textMuted }}>{s.label}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart quick-view */}
      {cartCount > 0 && (
        <div className="mx-4 mb-4 p-3 rounded-2xl flex items-center gap-3"
          style={{ background: `${C.primary}18`, border: `1px solid ${C.primary}44` }}>
          <span className="text-2xl">🛒</span>
          <div className="flex-1">
            <div className="font-bold text-sm" style={{ color: C.textPrimary }}>{cartCount} items in cart</div>
            <div className="text-xs" style={{ color: C.textMuted }}>
              Total: ₹{cart.reduce((s, c) => s + c.price * c.qty, 0)}
            </div>
          </div>
          <Btn className="px-4 py-2 text-xs">View Cart</Btn>
        </div>
      )}

      {/* Module grid */}
      <div className="px-4">
        <p className="text-xs font-bold mb-3" style={{ color: C.textMuted }}>EXPLORE FEATURES</p>
        <div className="grid grid-cols-3 gap-3">
          {modules.map(m => (
            <button key={m.id} onClick={() => setSubPage(m.id)}
              className="relative flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200"
              style={{ background: C.card, border: `1px solid ${C.border}` }}>
              {m.badge && (
                <span className="absolute top-2 right-2 text-xs font-black px-1.5 py-0.5 rounded-full text-white"
                  style={{ background: m.color, fontSize: "9px" }}>
                  {m.badge}
                </span>
              )}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: `${m.color}22` }}>
                {m.icon}
              </div>
              <span className="text-xs font-bold text-center leading-tight" style={{ color: C.textPrimary }}>
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <div className="px-4 mt-6">
        <p className="text-xs font-bold mb-3" style={{ color: C.textMuted }}>YOUR ACTIVITY</p>
        <Card className="p-4">
          {[
            { label: "Orders this month", value: "8",    bar: 80,  color: C.primary },
            { label: "Money saved",        value: "₹380", bar: 65,  color: C.success },
            { label: "Streak (days)",      value: "5",    bar: 50,  color: C.purple  },
          ].map(s => (
            <div key={s.label} className="mb-3 last:mb-0">
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color: C.textMuted }}>{s.label}</span>
                <span className="font-bold" style={{ color: s.color }}>{s.value}</span>
              </div>
              <ProgressBar value={s.bar} color={s.color} />
            </div>
          ))}
        </Card>
      </div>

      {/* Logout */}
      <div className="px-4 mt-6">
        <Btn variant="danger" onClick={() => setAuthed(false)} className="w-full py-3 text-sm">
          Sign Out
        </Btn>
      </div>
    </div>
  );
}
