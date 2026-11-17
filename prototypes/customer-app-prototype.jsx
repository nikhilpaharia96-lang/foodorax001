import { useState, useEffect, useRef } from "react";

// ============================================================
// DESIGN TOKENS & THEME
// ============================================================
const theme = {
  primary: "#FF6B00",
  primaryDark: "#FF3D00",
  dark: "#111827",
  darkCard: "#1F2937",
  light: "#F9FAFB",
  success: "#10B981",
  warning: "#F59E0B",
  purple: "#8B5CF6",
  blue: "#3B82F6",
};

// ============================================================
// MOCK DATA
// ============================================================
const categories = [
  { id: 1, name: "Assamese", emoji: "🍚", color: "#FF6B00" },
  { id: 2, name: "Budget", emoji: "💰", color: "#10B981" },
  { id: 3, name: "Gym Meals", emoji: "💪", color: "#8B5CF6" },
  { id: 4, name: "Fast Food", emoji: "🍔", color: "#EF4444" },
  { id: 5, name: "Tiffin", emoji: "🥡", color: "#F59E0B" },
  { id: 6, name: "Snacks", emoji: "🥨", color: "#EC4899" },
  { id: 7, name: "Drinks", emoji: "🥤", color: "#06B6D4" },
  { id: 8, name: "Desserts", emoji: "🍰", color: "#F97316" },
];

const restaurants = [
  {
    id: 1,
    name: "Maa Kitchen",
    cuisine: "Assamese • Home Food",
    rating: 4.8,
    deliveryTime: "20-30 min",
    minOrder: 49,
    distance: "0.8 km",
    image: "🏠",
    badge: "Popular",
    badgeColor: "#FF6B00",
    offer: "20% OFF",
    isVeg: false,
    tags: ["Assamese", "Home Style"],
    priceForTwo: 150,
  },
  {
    id: 2,
    name: "Protein House",
    cuisine: "Healthy • Gym Meals",
    rating: 4.6,
    deliveryTime: "25-35 min",
    minOrder: 99,
    distance: "1.2 km",
    image: "💪",
    badge: "Gym Fav",
    badgeColor: "#8B5CF6",
    offer: "Free Shake",
    isVeg: true,
    tags: ["Gym", "Healthy"],
    priceForTwo: 299,
  },
  {
    id: 3,
    name: "Chai Adda",
    cuisine: "Snacks • Beverages",
    rating: 4.5,
    deliveryTime: "10-15 min",
    minOrder: 29,
    distance: "0.3 km",
    image: "☕",
    badge: "Fastest",
    badgeColor: "#10B981",
    offer: "₹20 OFF",
    isVeg: true,
    tags: ["Snacks", "Budget"],
    priceForTwo: 80,
  },
  {
    id: 4,
    name: "Jagiroad Dhaba",
    cuisine: "North Indian • Assamese",
    rating: 4.7,
    deliveryTime: "30-40 min",
    minOrder: 79,
    distance: "1.5 km",
    image: "🍛",
    badge: "Top Rated",
    badgeColor: "#F59E0B",
    offer: "15% OFF",
    isVeg: false,
    tags: ["Assamese", "Thali"],
    priceForTwo: 200,
  },
  {
    id: 5,
    name: "Student Bites",
    cuisine: "Fast Food • Budget",
    rating: 4.4,
    deliveryTime: "15-20 min",
    minOrder: 49,
    distance: "0.6 km",
    image: "🍟",
    badge: "₹49 Meals",
    badgeColor: "#EF4444",
    offer: "Combo Deals",
    isVeg: false,
    tags: ["Budget", "Students"],
    priceForTwo: 120,
  },
  {
    id: 6,
    name: "River Fish Corner",
    cuisine: "Assamese • Seafood",
    rating: 4.9,
    deliveryTime: "35-45 min",
    minOrder: 120,
    distance: "2.1 km",
    image: "🐟",
    badge: "Local Fav",
    badgeColor: "#06B6D4",
    offer: "Fresh Daily",
    isVeg: false,
    tags: ["Assamese", "Seafood"],
    priceForTwo: 350,
  },
];

const menuItems = [
  { id: 1, restaurantId: 1, name: "Fish Curry + Rice", price: 89, calories: 520, protein: "18g", isVeg: false, category: "Assamese", desc: "Traditional Assamese fish curry with steamed rice", emoji: "🍛", popular: true },
  { id: 2, restaurantId: 1, name: "Duck Curry", price: 129, calories: 680, protein: "24g", isVeg: false, category: "Assamese", desc: "Authentic duck curry with bamboo shoot", emoji: "🦆", popular: true },
  { id: 3, restaurantId: 1, name: "Jolpan Platter", price: 59, calories: 380, protein: "8g", isVeg: true, category: "Assamese", desc: "Traditional Assamese breakfast platter", emoji: "🥣", popular: false },
  { id: 4, restaurantId: 2, name: "Protein Bowl", price: 149, calories: 420, protein: "36g", isVeg: true, category: "Gym", desc: "High-protein bowl with quinoa and veggies", emoji: "🥗", popular: true },
  { id: 5, restaurantId: 2, name: "Egg White Omelette", price: 79, calories: 180, protein: "22g", isVeg: false, category: "Gym", desc: "6 egg whites with veggies - perfect post-workout", emoji: "🍳", popular: true },
  { id: 6, restaurantId: 3, name: "Chai + Samosa", price: 29, calories: 280, protein: "6g", isVeg: true, category: "Snacks", desc: "Hot masala chai with crispy samosa", emoji: "☕", popular: true },
  { id: 7, restaurantId: 5, name: "₹49 Student Combo", price: 49, calories: 480, protein: "14g", isVeg: false, category: "Budget", desc: "Rice + Dal + Sabzi - the ultimate student meal", emoji: "🍱", popular: true },
  { id: 8, restaurantId: 4, name: "Assamese Thali", price: 119, calories: 720, protein: "20g", isVeg: false, category: "Assamese", desc: "Complete Assamese thali with 8 items", emoji: "🍽️", popular: true },
];

const orders = [
  { id: "FX001", restaurant: "Maa Kitchen", items: ["Fish Curry + Rice", "Duck Curry"], total: 218, status: "delivered", date: "Today, 1:30 PM", rating: 5 },
  { id: "FX002", restaurant: "Chai Adda", items: ["Chai + Samosa x3"], total: 87, status: "delivered", date: "Yesterday, 4:00 PM", rating: 4 },
  { id: "FX003", restaurant: "Protein House", items: ["Protein Bowl", "Egg White Omelette"], total: 228, status: "delivered", date: "2 days ago", rating: 5 },
];

const gymMeals = [
  { name: "Pre-Workout Bowl", cal: 320, protein: "28g", price: 129, emoji: "🥗" },
  { name: "Post-Workout Shake", cal: 180, protein: "32g", price: 89, emoji: "🥤" },
  { name: "Egg White Boost", cal: 180, protein: "22g", price: 79, emoji: "🍳" },
  { name: "Grilled Chicken", cal: 380, protein: "42g", price: 159, emoji: "🍗" },
];

const assameseSpecials = [
  { name: "Masor Tenga", desc: "Tangy fish curry", price: 99, emoji: "🐟" },
  { name: "Hanh'r Mangxo", desc: "Duck meat curry", price: 139, emoji: "🦆" },
  { name: "Xaak Bhaji", desc: "Leafy greens stir-fry", price: 49, emoji: "🥬" },
  { name: "Pitha", desc: "Traditional rice cake", price: 39, emoji: "🫓" },
  { name: "Jolpan", desc: "Traditional breakfast", price: 59, emoji: "🥣" },
  { name: "Aloo Pitika", desc: "Mashed potato Assamese style", price: 39, emoji: "🥔" },
];

const banners = [
  { title: "₹49 Student Meals", sub: "Hot food to your hostel room!", color: "from-orange-600 to-red-600", emoji: "🍱" },
  { title: "Gym Protein Meals", sub: "Fuel your gains — delivered fast!", color: "from-purple-600 to-violet-800", emoji: "💪" },
  { title: "Assamese Food", sub: "Authentic local flavors, doorstep delivery", color: "from-green-600 to-emerald-700", emoji: "🍚" },
];

// ============================================================
// UTILITY COMPONENTS
// ============================================================

function StarRating({ rating, size = "sm" }) {
  const s = size === "sm" ? "text-xs" : "text-sm";
  return (
    <span className={`${s} font-bold text-yellow-400`}>★ {rating}</span>
  );
}

function Badge({ text, color }) {
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
      style={{ backgroundColor: color || theme.primary }}
    >
      {text}
    </span>
  );
}

function VegIndicator({ isVeg }) {
  return (
    <span
      className={`inline-block w-4 h-4 border-2 rounded-sm flex items-center justify-center text-xs`}
      style={{ borderColor: isVeg ? "#10B981" : "#EF4444" }}
    >
      <span
        className="w-2 h-2 rounded-full block"
        style={{ backgroundColor: isVeg ? "#10B981" : "#EF4444" }}
      />
    </span>
  );
}

// ============================================================
// BOTTOM NAVIGATION
// ============================================================
function BottomNav({ page, setPage, cartCount }) {
  const tabs = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "search", label: "Search", icon: "🔍" },
    { id: "orders", label: "Orders", icon: "📦" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto">
      <div
        className="flex items-center justify-around py-3 px-2"
        style={{
          background: "rgba(17,24,39,0.97)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,107,0,0.15)",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPage(tab.id)}
            className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200 relative"
            style={{
              color: page === tab.id ? theme.primary : "#6B7280",
              transform: page === tab.id ? "scale(1.1)" : "scale(1)",
            }}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs font-semibold">{tab.label}</span>
            {page === tab.id && (
              <span
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                style={{ backgroundColor: theme.primary }}
              />
            )}
          </button>
        ))}
        <button
          onClick={() => setPage("cart")}
          className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl relative"
          style={{ color: page === "cart" ? theme.primary : "#6B7280" }}
        >
          <span className="text-xl relative">
            🛒
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
                style={{ backgroundColor: theme.primary, fontSize: "10px" }}
              >
                {cartCount}
              </span>
            )}
          </span>
          <span className="text-xs font-semibold">Cart</span>
          {page === "cart" && (
            <span
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
              style={{ backgroundColor: theme.primary }}
            />
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({ setPage, setSelectedRestaurant, cart, setCart }) {
  const [activeBanner, setActiveBanner] = useState(0);
  const [darkMode] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setActiveBanner((p) => (p + 1) % banners.length), 3000);
    return () => clearInterval(t);
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === item.id);
      if (exists) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  return (
    <div className="pb-24" style={{ background: "#0D1117", minHeight: "100vh", color: "#F9FAFB" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40 px-4 py-3"
        style={{ background: "rgba(13,17,23,0.95)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">Delivering to</span>
              <span className="text-xs font-bold" style={{ color: theme.primary }}>📍</span>
            </div>
            <div className="font-black text-white text-base tracking-tight">
              Jagiroad, Assam
              <span className="text-gray-400 ml-1 text-sm">▼</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
              style={{ background: "rgba(255,107,0,0.15)", border: "1px solid rgba(255,107,0,0.3)" }}
            >
              🔔
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <button
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-left"
          style={{ background: "#1F2937", border: "1px solid rgba(255,255,255,0.08)" }}
          onClick={() => setPage("search")}
        >
          <span className="text-gray-400">🔍</span>
          <span className="text-gray-500 text-sm">Search for food, restaurants...</span>
        </button>
      </div>

      {/* Hero Logo */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <div
          className="text-2xl font-black tracking-tighter"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          FoodoraX
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-bold text-white" style={{ background: theme.primary }}>
          BETA
        </span>
      </div>

      {/* Banners */}
      <div className="px-4 mb-5">
        <div className="overflow-hidden rounded-2xl relative" style={{ height: 140 }}>
          {banners.map((b, i) => (
            <div
              key={i}
              className={`absolute inset-0 flex flex-col justify-center px-6 transition-all duration-500`}
              style={{
                background: `linear-gradient(135deg, ${b.color.replace("from-", "").replace("to-", "")})`,
                backgroundImage: `linear-gradient(135deg, ${
                  b.color.includes("orange") ? "#EA580C, #DC2626" :
                  b.color.includes("purple") ? "#9333EA, #6D28D9" :
                  "#059669, #065F46"
                })`,
                opacity: activeBanner === i ? 1 : 0,
                transform: activeBanner === i ? "translateX(0)" : "translateX(30px)",
                transition: "all 0.5s ease",
              }}
            >
              <div className="text-5xl absolute right-5 top-1/2 -translate-y-1/2 opacity-40">{b.emoji}</div>
              <span className="text-white font-black text-2xl leading-tight">{b.title}</span>
              <span className="text-white/80 text-sm mt-1">{b.sub}</span>
              <button
                className="mt-2 text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white w-fit"
              >
                Order Now →
              </button>
            </div>
          ))}
          <div className="absolute bottom-3 left-6 flex gap-1">
            {banners.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: activeBanner === i ? 16 : 6,
                  height: 6,
                  background: activeBanner === i ? "white" : "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-5">
        <div className="px-4 flex items-center justify-between mb-3">
          <h2 className="font-black text-white text-lg">Categories</h2>
          <button className="text-xs font-semibold" style={{ color: theme.primary }}>See all</button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="flex flex-col items-center gap-2 flex-shrink-0"
              onClick={() => setPage("search")}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{
                  background: `${cat.color}20`,
                  border: `1.5px solid ${cat.color}40`,
                }}
              >
                {cat.emoji}
              </div>
              <span className="text-xs font-semibold text-gray-300 whitespace-nowrap">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ₹49 Student Special Banner */}
      <div className="px-4 mb-5">
        <div
          className="rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1a0a00, #2d1200)", border: "1px solid rgba(255,107,0,0.3)" }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-32 opacity-10 text-8xl flex items-center justify-center">🎓</div>
          <div className="flex-1">
            <div className="text-xs font-bold mb-1" style={{ color: theme.primary }}>STUDENT SPECIAL 🎓</div>
            <div className="text-white font-black text-xl">Meals from ₹49</div>
            <div className="text-gray-400 text-xs mt-0.5">Hostel delivery • No min order</div>
          </div>
          <button
            className="text-sm font-black px-4 py-2 rounded-xl text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}
            onClick={() => setPage("search")}
          >
            Order
          </button>
        </div>
      </div>

      {/* Trending Restaurants */}
      <div className="mb-5">
        <div className="px-4 flex items-center justify-between mb-3">
          <h2 className="font-black text-white text-lg">🔥 Trending Near You</h2>
          <button className="text-xs font-semibold" style={{ color: theme.primary }}>See all</button>
        </div>
        <div className="flex gap-4 px-4 overflow-x-auto pb-2 scrollbar-hide">
          {restaurants.slice(0, 4).map((r) => (
            <button
              key={r.id}
              className="flex-shrink-0 rounded-2xl overflow-hidden text-left"
              style={{
                width: 200,
                background: "#1F2937",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              onClick={() => { setSelectedRestaurant(r); setPage("restaurant"); }}
            >
              <div
                className="h-28 flex items-center justify-center text-6xl relative"
                style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}
              >
                {r.image}
                <div className="absolute top-2 left-2">
                  <Badge text={r.badge} color={r.badgeColor} />
                </div>
                <div
                  className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(0,0,0,0.6)", color: "#FFD700" }}
                >
                  {r.offer}
                </div>
              </div>
              <div className="p-3">
                <div className="font-bold text-white text-sm truncate">{r.name}</div>
                <div className="text-gray-400 text-xs truncate">{r.cuisine}</div>
                <div className="flex items-center justify-between mt-2">
                  <StarRating rating={r.rating} />
                  <span className="text-xs text-gray-400">{r.deliveryTime}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">Min ₹{r.minOrder}</span>
                  <span className="text-xs text-gray-500">{r.distance}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Assamese Food Section */}
      <div className="mb-5">
        <div className="px-4 flex items-center justify-between mb-3">
          <h2 className="font-black text-white text-lg">🍚 Assamese Specials</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 px-4">
          {assameseSpecials.slice(0, 4).map((item, i) => (
            <button
              key={i}
              className="p-3 rounded-2xl text-left flex items-center gap-3"
              style={{ background: "#1F2937", border: "1px solid rgba(255,255,255,0.06)" }}
              onClick={() => {
                addToCart({ id: 100 + i, name: item.name, price: item.price, qty: 1, emoji: item.emoji, restaurantId: 1 });
              }}
            >
              <span className="text-3xl">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-bold truncate">{item.name}</div>
                <div className="text-gray-500 text-xs truncate">{item.desc}</div>
                <div className="font-black text-sm mt-0.5" style={{ color: theme.primary }}>₹{item.price}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Gym Meals */}
      <div className="mb-5">
        <div className="px-4 flex items-center justify-between mb-3">
          <h2 className="font-black text-white text-lg">💪 Gym Meals</h2>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-2 scrollbar-hide">
          {gymMeals.map((m, i) => (
            <div
              key={i}
              className="flex-shrink-0 p-3 rounded-2xl"
              style={{
                width: 150,
                background: "linear-gradient(135deg, #1a0d2e, #1F2937)",
                border: "1px solid rgba(139,92,246,0.2)",
              }}
            >
              <div className="text-4xl mb-2">{m.emoji}</div>
              <div className="text-white font-bold text-xs">{m.name}</div>
              <div className="text-purple-400 text-xs mt-1">Protein: {m.protein}</div>
              <div className="text-gray-500 text-xs">{m.cal} kcal</div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-black text-sm" style={{ color: theme.primary }}>₹{m.price}</span>
                <button
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: theme.primary }}
                  onClick={() => addToCart({ id: 200 + i, name: m.name, price: m.price, qty: 1, emoji: m.emoji, restaurantId: 2 })}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Restaurants */}
      <div className="px-4 mb-5">
        <h2 className="font-black text-white text-lg mb-3">🏪 All Restaurants</h2>
        <div className="flex flex-col gap-3">
          {restaurants.map((r) => (
            <button
              key={r.id}
              className="rounded-2xl overflow-hidden flex text-left"
              style={{ background: "#1F2937", border: "1px solid rgba(255,255,255,0.06)" }}
              onClick={() => { setSelectedRestaurant(r); setPage("restaurant"); }}
            >
              <div
                className="w-28 h-24 flex items-center justify-center text-5xl flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}
              >
                {r.image}
              </div>
              <div className="p-3 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{r.name}</span>
                  <Badge text={r.badge} color={r.badgeColor} />
                </div>
                <div className="text-gray-400 text-xs mt-0.5 truncate">{r.cuisine}</div>
                <div className="flex items-center gap-3 mt-1">
                  <StarRating rating={r.rating} />
                  <span className="text-xs text-gray-500">{r.deliveryTime}</span>
                  <span className="text-xs text-gray-500">{r.distance}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-semibold" style={{ color: "#10B981" }}>{r.offer}</span>
                  <span className="text-xs text-gray-500">₹{r.priceForTwo} for 2</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FoodoraX Air Teaser */}
      <div className="px-4 mb-6">
        <div
          className="rounded-2xl p-4 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0c0c1d, #1a1a3e)", border: "1px solid rgba(99,102,241,0.3)" }}
        >
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-7xl opacity-20">🚁</div>
          <div className="text-xs font-bold mb-1" style={{ color: "#818CF8" }}>COMING SOON</div>
          <div className="text-white font-black text-xl">FoodoraX Air 🚁</div>
          <div className="text-gray-400 text-xs mt-1">Drone delivery to your hostel rooftop</div>
          <div className="flex gap-2 mt-3">
            {["Campus Zones", "QR Pickup", "2-Min Drop"].map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded-lg bg-indigo-900/50 text-indigo-300 font-medium">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SEARCH PAGE
// ============================================================
function SearchPage({ setPage, setSelectedRestaurant }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Veg", "Non-Veg", "Budget", "Gym", "Assamese", "Fast"];

  const filtered = restaurants.filter((r) => {
    const matchQ = r.name.toLowerCase().includes(query.toLowerCase()) || r.cuisine.toLowerCase().includes(query.toLowerCase());
    if (filter === "All") return matchQ;
    if (filter === "Veg") return matchQ && r.isVeg;
    if (filter === "Non-Veg") return matchQ && !r.isVeg;
    return matchQ && r.tags.some((t) => t.toLowerCase().includes(filter.toLowerCase()));
  });

  return (
    <div className="pb-24" style={{ background: "#0D1117", minHeight: "100vh", color: "#F9FAFB" }}>
      <div className="px-4 pt-4 pb-3" style={{ background: "rgba(13,17,23,0.97)" }}>
        <h1 className="font-black text-white text-xl mb-3">Search 🔍</h1>
        <input
          className="w-full px-4 py-3 rounded-2xl text-white text-sm outline-none"
          style={{ background: "#1F2937", border: "1px solid rgba(255,255,255,0.08)" }}
          placeholder="Search restaurants, dishes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 transition-all"
            style={{
              background: filter === f ? theme.primary : "#1F2937",
              color: filter === f ? "white" : "#9CA3AF",
              border: `1px solid ${filter === f ? theme.primary : "rgba(255,255,255,0.08)"}`,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="px-4">
        <div className="text-xs text-gray-500 mb-3">{filtered.length} results</div>
        <div className="flex flex-col gap-3">
          {filtered.map((r) => (
            <button
              key={r.id}
              className="rounded-2xl overflow-hidden flex text-left"
              style={{ background: "#1F2937", border: "1px solid rgba(255,255,255,0.06)" }}
              onClick={() => { setSelectedRestaurant(r); setPage("restaurant"); }}
            >
              <div className="w-24 h-20 flex items-center justify-center text-4xl flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}>
                {r.image}
              </div>
              <div className="p-3 flex-1 min-w-0">
                <div className="font-bold text-white text-sm">{r.name}</div>
                <div className="text-gray-400 text-xs">{r.cuisine}</div>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={r.rating} />
                  <span className="text-xs text-gray-500">{r.deliveryTime}</span>
                </div>
                <div className="text-xs font-semibold mt-1" style={{ color: "#10B981" }}>{r.offer}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// RESTAURANT PAGE
// ============================================================
function RestaurantPage({ restaurant, setPage, cart, setCart }) {
  const [activeTab, setActiveTab] = useState("menu");
  const items = menuItems.filter((m) => m.restaurantId === restaurant?.id);
  const r = restaurant;

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === item.id);
      if (exists) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const getQty = (id) => cart.find((c) => c.id === id)?.qty || 0;

  if (!r) return null;
  return (
    <div className="pb-24" style={{ background: "#0D1117", minHeight: "100vh", color: "#F9FAFB" }}>
      {/* Hero */}
      <div className="relative">
        <div
          className="h-48 flex items-center justify-center text-8xl"
          style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}
        >
          {r.image}
        </div>
        <button
          onClick={() => setPage("home")}
          className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          ←
        </button>
        <div className="absolute top-4 right-4">
          <Badge text={r.badge} color={r.badgeColor} />
        </div>
      </div>

      {/* Info */}
      <div
        className="px-4 py-4 rounded-t-3xl -mt-4 relative"
        style={{ background: "#0D1117" }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-black text-white text-2xl">{r.name}</h1>
            <p className="text-gray-400 text-sm">{r.cuisine}</p>
          </div>
          <div
            className="px-3 py-1.5 rounded-xl text-xs font-bold"
            style={{ background: "rgba(255,107,0,0.15)", color: theme.primary }}
          >
            {r.offer}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-sm">
            <StarRating rating={r.rating} size="md" />
            <span className="text-gray-500 text-xs">({Math.floor(Math.random() * 500 + 100)})</span>
          </div>
          <span className="text-gray-600">•</span>
          <span className="text-gray-400 text-sm">⏱ {r.deliveryTime}</span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-400 text-sm">📍 {r.distance}</span>
        </div>

        <div className="flex gap-2 mt-3">
          {r.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded-lg text-gray-300"
              style={{ background: "#1F2937" }}>
              {t}
            </span>
          ))}
          <span className="text-xs px-2 py-1 rounded-lg text-gray-300" style={{ background: "#1F2937" }}>
            Min ₹{r.minOrder}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 mb-4">
        {["menu", "reviews"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-2 rounded-xl text-sm font-bold capitalize transition-all"
            style={{
              background: activeTab === tab ? theme.primary : "#1F2937",
              color: activeTab === tab ? "white" : "#6B7280",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Menu */}
      {activeTab === "menu" && (
        <div className="px-4 flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <div className="text-4xl mb-2">🍽️</div>
              <div>Menu coming soon</div>
              {/* Show some generic items */}
            </div>
          ) : null}
          {(items.length > 0 ? items : menuItems.slice(0, 4)).map((item) => (
            <div
              key={item.id}
              className="flex gap-3 p-3 rounded-2xl"
              style={{ background: "#1F2937", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="text-5xl flex-shrink-0">{item.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <VegIndicator isVeg={item.isVeg} />
                  <span className="font-bold text-white text-sm">{item.name}</span>
                  {item.popular && <Badge text="Popular" color={theme.primary} />}
                </div>
                <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{item.desc}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500">🔥 {item.calories} kcal</span>
                  <span className="text-xs text-purple-400">💪 {item.protein}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-black text-base" style={{ color: theme.primary }}>₹{item.price}</span>
                  {getQty(item.id) === 0 ? (
                    <button
                      className="px-4 py-1 rounded-xl text-sm font-bold text-white"
                      style={{ background: theme.primary }}
                      onClick={() => addToCart(item)}
                    >
                      + Add
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold"
                        style={{ background: "#374151", color: "white" }}
                        onClick={() => setCart((p) => p.map((c) => c.id === item.id ? { ...c, qty: c.qty - 1 } : c).filter((c) => c.qty > 0))}
                      >
                        −
                      </button>
                      <span className="font-bold text-white w-5 text-center">{getQty(item.id)}</span>
                      <button
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white"
                        style={{ background: theme.primary }}
                        onClick={() => addToCart(item)}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="px-4 flex flex-col gap-3">
          {[
            { name: "Rahul K.", rating: 5, text: "Amazing food! Delivered in 20 mins. Best in Jagiroad 🔥", time: "2 days ago" },
            { name: "Priya B.", rating: 4, text: "Fish curry was authentic. Will order again!", time: "1 week ago" },
            { name: "Amit S.", rating: 5, text: "Student combo is a lifesaver. So affordable!", time: "3 days ago" },
          ].map((rev, i) => (
            <div key={i} className="p-3 rounded-2xl" style={{ background: "#1F2937" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{ background: theme.primary }}>
                    {rev.name[0]}
                  </div>
                  <span className="font-bold text-white text-sm">{rev.name}</span>
                </div>
                <span className="text-gray-500 text-xs">{rev.time}</span>
              </div>
              <div className="mt-1 ml-10">
                <StarRating rating={rev.rating} />
                <p className="text-gray-400 text-xs mt-1">{rev.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// CART PAGE
// ============================================================
function CartPage({ cart, setCart, setPage }) {
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [address, setAddress] = useState("Hostel Block A, Room 204");
  const [payMethod, setPayMethod] = useState("cod");

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const discount = couponApplied ? Math.floor(subtotal * 0.1) : 0;
  const delivery = subtotal > 199 ? 0 : 29;
  const tax = Math.floor((subtotal - discount) * 0.05);
  const total = subtotal - discount + delivery + tax;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "STUDENT10" || coupon.toUpperCase() === "FOODORAX") {
      setCouponApplied(true);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pb-24" style={{ background: "#0D1117" }}>
        <div className="text-8xl mb-4">🛒</div>
        <h2 className="text-white font-black text-2xl">Cart is empty!</h2>
        <p className="text-gray-400 text-sm mt-2">Add items to get started</p>
        <button
          className="mt-6 px-8 py-3 rounded-2xl font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}
          onClick={() => setPage("home")}
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24" style={{ background: "#0D1117", minHeight: "100vh", color: "#F9FAFB" }}>
      <div className="px-4 pt-4 pb-3">
        <h1 className="font-black text-white text-2xl">Your Cart 🛒</h1>
        <p className="text-gray-400 text-sm">{cart.reduce((s, c) => s + c.qty, 0)} items</p>
      </div>

      {/* Cart Items */}
      <div className="px-4 flex flex-col gap-3 mb-4">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl"
            style={{ background: "#1F2937" }}>
            <span className="text-3xl">{item.emoji || "🍽️"}</span>
            <div className="flex-1">
              <div className="text-white font-bold text-sm">{item.name}</div>
              <div className="font-black" style={{ color: theme.primary }}>₹{item.price}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white"
                style={{ background: "#374151" }}
                onClick={() => setCart((p) => p.map((c) => c.id === item.id ? { ...c, qty: c.qty - 1 } : c).filter((c) => c.qty > 0))}
              >−</button>
              <span className="font-bold text-white w-5 text-center">{item.qty}</span>
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white"
                style={{ background: theme.primary }}
                onClick={() => setCart((p) => p.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c))}
              >+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Address */}
      <div className="px-4 mb-4">
        <h3 className="font-bold text-white text-sm mb-2">📍 Delivery Address</h3>
        <input
          className="w-full px-4 py-3 rounded-2xl text-white text-sm outline-none"
          style={{ background: "#1F2937", border: "1px solid rgba(255,255,255,0.08)" }}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="flex gap-2 mt-2">
          {["Hostel Block A", "Library Gate", "Canteen"].map((loc) => (
            <button
              key={loc}
              onClick={() => setAddress(loc)}
              className="text-xs px-2 py-1 rounded-lg"
              style={{ background: "#1F2937", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Coupon */}
      <div className="px-4 mb-4">
        <h3 className="font-bold text-white text-sm mb-2">🎟 Apply Coupon</h3>
        <div className="flex gap-2">
          <input
            className="flex-1 px-4 py-3 rounded-2xl text-white text-sm outline-none"
            style={{ background: "#1F2937", border: couponApplied ? "1px solid #10B981" : "1px solid rgba(255,255,255,0.08)" }}
            placeholder="STUDENT10 or FOODORAX"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button
            className="px-4 py-3 rounded-2xl text-sm font-bold"
            style={{ background: couponApplied ? "#10B981" : theme.primary, color: "white" }}
            onClick={applyCoupon}
          >
            {couponApplied ? "✓" : "Apply"}
          </button>
        </div>
        {couponApplied && <p className="text-green-400 text-xs mt-1">✓ 10% discount applied!</p>}
      </div>

      {/* Payment */}
      <div className="px-4 mb-4">
        <h3 className="font-bold text-white text-sm mb-2">💳 Payment Method</h3>
        <div className="flex flex-col gap-2">
          {[
            { id: "cod", label: "Cash on Delivery", icon: "💵" },
            { id: "razorpay", label: "Razorpay (UPI / Card)", icon: "💳" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setPayMethod(m.id)}
              className="flex items-center gap-3 p-3 rounded-2xl text-left"
              style={{
                background: "#1F2937",
                border: payMethod === m.id ? `1.5px solid ${theme.primary}` : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span className="text-xl">{m.icon}</span>
              <span className="text-white font-semibold text-sm flex-1">{m.label}</span>
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: payMethod === m.id ? theme.primary : "#4B5563" }}
              >
                {payMethod === m.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: theme.primary }} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bill Summary */}
      <div className="px-4 mb-4">
        <div className="p-4 rounded-2xl" style={{ background: "#1F2937" }}>
          <h3 className="font-bold text-white text-sm mb-3">Bill Summary</h3>
          {[
            { label: "Subtotal", value: `₹${subtotal}` },
            ...(discount > 0 ? [{ label: "Discount (10%)", value: `-₹${discount}`, color: "#10B981" }] : []),
            { label: `Delivery (${delivery === 0 ? "Free!" : "₹" + delivery})`, value: delivery === 0 ? "FREE" : `₹${delivery}`, color: delivery === 0 ? "#10B981" : undefined },
            { label: "GST (5%)", value: `₹${tax}` },
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-400">{row.label}</span>
              <span style={{ color: row.color || "#F9FAFB" }} className="font-semibold">{row.value}</span>
            </div>
          ))}
          <div className="border-t border-gray-700 mt-3 pt-3 flex justify-between">
            <span className="font-black text-white text-base">Total</span>
            <span className="font-black text-base" style={{ color: theme.primary }}>₹{total}</span>
          </div>
        </div>
      </div>

      {/* Place Order */}
      <div className="px-4">
        <button
          className="w-full py-4 rounded-2xl font-black text-white text-lg"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}
          onClick={() => setPage("ordertrack")}
        >
          Place Order • ₹{total}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// ORDER TRACKING PAGE
// ============================================================
function OrderTrackPage({ setPage, setCart }) {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Order Placed", icon: "✅", done: true },
    { label: "Restaurant Confirmed", icon: "🍳", done: step >= 1 },
    { label: "Food Being Prepared", icon: "👨‍🍳", done: step >= 2 },
    { label: "Out for Delivery", icon: "🛵", done: step >= 3 },
    { label: "Delivered!", icon: "🎉", done: step >= 4 },
  ];

  useEffect(() => {
    if (step < 4) {
      const t = setTimeout(() => setStep((p) => p + 1), 2000);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div className="pb-24" style={{ background: "#0D1117", minHeight: "100vh", color: "#F9FAFB" }}>
      <div className="px-4 pt-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">{step === 4 ? "🎉" : "🛵"}</div>
          <h1 className="font-black text-white text-2xl">
            {step === 4 ? "Order Delivered!" : "Order on the way!"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">Order #FX{Math.floor(Math.random() * 9000 + 1000)}</p>
        </div>

        {/* ETA */}
        {step < 4 && (
          <div
            className="p-4 rounded-2xl mb-6 text-center"
            style={{ background: "linear-gradient(135deg, rgba(255,107,0,0.15), rgba(255,61,0,0.1))", border: "1px solid rgba(255,107,0,0.3)" }}
          >
            <div className="text-3xl font-black" style={{ color: theme.primary }}>
              ~{20 - step * 4} mins
            </div>
            <div className="text-gray-400 text-sm">Estimated delivery time</div>
          </div>
        )}

        {/* Steps */}
        <div className="flex flex-col gap-3 mb-6">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500"
                style={{
                  background: s.done ? theme.primary : "#1F2937",
                  border: `2px solid ${s.done ? theme.primary : "#374151"}`,
                }}
              >
                {s.icon}
              </div>
              <div className="flex-1">
                <div className={`font-bold text-sm ${s.done ? "text-white" : "text-gray-600"}`}>{s.label}</div>
              </div>
              {s.done && <span className="text-green-400 text-xs">✓</span>}
            </div>
          ))}
        </div>

        {/* Map Placeholder */}
        <div
          className="rounded-2xl p-4 mb-6 flex items-center justify-center"
          style={{
            background: "#1F2937",
            height: 160,
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🗺️</div>
            <div className="text-sm">Live tracking map</div>
            <div className="text-xs">(Google Maps integration)</div>
          </div>
        </div>

        {/* Delivery Partner */}
        <div className="p-3 rounded-2xl flex items-center gap-3 mb-6"
          style={{ background: "#1F2937" }}>
          <div className="w-10 h-10 rounded-full bg-orange-900 flex items-center justify-center text-xl">🛵</div>
          <div className="flex-1">
            <div className="text-white font-bold text-sm">Bikash Sharma</div>
            <div className="text-gray-400 text-xs">Your delivery partner</div>
          </div>
          <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: theme.primary }}>
            📞
          </button>
        </div>

        {step === 4 && (
          <button
            className="w-full py-4 rounded-2xl font-black text-white text-lg"
            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}
            onClick={() => { setCart([]); setPage("home"); }}
          >
            Rate & Order Again 🌟
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ORDERS PAGE
// ============================================================
function OrdersPage({ setPage }) {
  return (
    <div className="pb-24" style={{ background: "#0D1117", minHeight: "100vh", color: "#F9FAFB" }}>
      <div className="px-4 pt-6 pb-3">
        <h1 className="font-black text-white text-2xl">My Orders 📦</h1>
      </div>

      {/* Active Order Teaser */}
      <div className="px-4 mb-4">
        <div
          className="p-4 rounded-2xl"
          style={{ background: "linear-gradient(135deg, rgba(255,107,0,0.15), rgba(255,61,0,0.1))", border: "1px solid rgba(255,107,0,0.3)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: theme.primary }}>ACTIVE ORDER</div>
              <div className="text-white font-bold">Maa Kitchen</div>
              <div className="text-gray-400 text-xs">Delivering in ~18 mins 🛵</div>
            </div>
            <button
              className="text-sm font-bold px-4 py-2 rounded-xl text-white"
              style={{ background: theme.primary }}
              onClick={() => setPage("ordertrack")}
            >
              Track
            </button>
          </div>
        </div>
      </div>

      {/* Past Orders */}
      <div className="px-4">
        <h2 className="font-bold text-white text-base mb-3">Past Orders</h2>
        <div className="flex flex-col gap-3">
          {orders.map((o) => (
            <div key={o.id} className="p-4 rounded-2xl" style={{ background: "#1F2937" }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-white text-sm">{o.restaurant}</div>
                  <div className="text-gray-500 text-xs">{o.date}</div>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}
                >
                  {o.status}
                </span>
              </div>
              <div className="text-gray-400 text-xs mb-2">{o.items.join(", ")}</div>
              <div className="flex items-center justify-between">
                <div className="text-white font-black">₹{o.total}</div>
                <div className="flex items-center gap-2">
                  <StarRating rating={o.rating} />
                  <button
                    className="text-xs font-bold px-3 py-1.5 rounded-xl"
                    style={{ background: "rgba(255,107,0,0.15)", color: theme.primary }}
                  >
                    Reorder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PROFILE PAGE
// ============================================================
function ProfilePage({ setPage, setView }) {
  const menuItems2 = [
    { icon: "📍", label: "Saved Addresses", desc: "Hostel, Library, Home" },
    { icon: "❤️", label: "Favorites", desc: "3 restaurants saved" },
    { icon: "🎟", label: "Coupons & Offers", desc: "2 active coupons" },
    { icon: "🍱", label: "Meal Subscriptions", desc: "Daily tiffin plans" },
    { icon: "👥", label: "Group Orders", desc: "Order for your squad" },
    { icon: "🔔", label: "Notifications", desc: "Order, offers alerts" },
    { icon: "🏪", label: "Restaurant Dashboard", action: () => setView("restaurant") },
    { icon: "🛵", label: "Delivery Partner", action: () => setView("delivery") },
    { icon: "⚙️", label: "Admin Panel", action: () => setView("admin") },
    { icon: "❓", label: "Help & Support", desc: "" },
  ];

  return (
    <div className="pb-24" style={{ background: "#0D1117", minHeight: "100vh", color: "#F9FAFB" }}>
      {/* Profile Header */}
      <div className="px-4 pt-6 pb-4"
        style={{ background: "linear-gradient(180deg, #1a0a00 0%, #0D1117 100%)" }}>
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black"
            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}
          >
            R
          </div>
          <div>
            <h2 className="font-black text-white text-2xl">Rahul Bora</h2>
            <p className="text-gray-400 text-sm">rahul@college.edu</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: theme.primary }}>
                🎓 Student
              </span>
              <span className="text-xs text-gray-500">Jagiroad, Assam</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "Orders", value: "24" },
            { label: "Saved", value: "₹380" },
            { label: "Points", value: "1,240" },
          ].map((s) => (
            <div key={s.label} className="text-center p-3 rounded-2xl" style={{ background: "#1F2937" }}>
              <div className="font-black text-white text-xl">{s.value}</div>
              <div className="text-gray-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Card */}
      <div className="px-4 mb-4">
        <div
          className="p-4 rounded-2xl"
          style={{ background: "linear-gradient(135deg, #1a1a3e, #1F2937)", border: "1px solid rgba(99,102,241,0.3)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold" style={{ color: "#818CF8" }}>REFERRAL CODE</div>
              <div className="font-black text-white text-xl tracking-widest mt-1">RAHUL50</div>
              <div className="text-gray-400 text-xs mt-0.5">Share & earn ₹50 per referral</div>
            </div>
            <button className="px-3 py-2 rounded-xl text-sm font-bold text-white"
              style={{ background: "#4F46E5" }}>Share</button>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 flex flex-col gap-2">
        {menuItems2.map((item, i) => (
          <button
            key={i}
            className="flex items-center gap-3 p-3 rounded-2xl text-left w-full"
            style={{ background: "#1F2937" }}
            onClick={item.action}
          >
            <span className="text-2xl w-8">{item.icon}</span>
            <div className="flex-1">
              <div className="font-bold text-white text-sm">{item.label}</div>
              {item.desc && <div className="text-gray-500 text-xs">{item.desc}</div>}
            </div>
            <span className="text-gray-600">›</span>
          </button>
        ))}
      </div>

      <div className="px-4 mt-4">
        <button className="w-full py-3 rounded-2xl font-bold text-red-400 text-sm"
          style={{ background: "rgba(239,68,68,0.1)" }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ============================================================
// RESTAURANT DASHBOARD
// ============================================================
function RestaurantDashboard({ setView }) {
  const [tab, setTab] = useState("orders");
  const pendingOrders = [
    { id: "FX100", customer: "Rahul B.", items: "Fish Curry × 2, Rice × 2", total: 218, time: "5 min ago" },
    { id: "FX101", customer: "Priya D.", items: "₹49 Combo × 3", total: 147, time: "2 min ago" },
  ];

  return (
    <div className="pb-24" style={{ background: "#0D1117", minHeight: "100vh", color: "#F9FAFB" }}>
      <div className="px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: "rgba(13,17,23,0.97)" }}>
        <button onClick={() => setView("app")} className="text-2xl">←</button>
        <div>
          <h1 className="font-black text-white text-xl">Restaurant Dashboard</h1>
          <p className="text-xs text-green-400">● Online • Maa Kitchen</p>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-2 gap-3 px-4 my-4">
        {[
          { label: "Today's Revenue", value: "₹3,240", change: "+18%", icon: "💰" },
          { label: "Orders Today", value: "28", change: "+5", icon: "📦" },
          { label: "Avg Rating", value: "4.8 ★", change: "Top 5%", icon: "⭐" },
          { label: "Pending", value: "3", change: "Act now!", icon: "⏳" },
        ].map((s) => (
          <div key={s.label} className="p-3 rounded-2xl" style={{ background: "#1F2937" }}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-black text-white text-xl">{s.value}</div>
            <div className="text-gray-500 text-xs">{s.label}</div>
            <div className="text-green-400 text-xs font-bold">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 mb-4">
        {["orders", "menu", "analytics"].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-xl text-xs font-bold capitalize"
            style={{ background: tab === t ? theme.primary : "#1F2937", color: tab === t ? "white" : "#6B7280" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <div className="px-4 flex flex-col gap-3">
          <h3 className="text-white font-bold text-sm">🔔 Pending Orders</h3>
          {pendingOrders.map((o) => (
            <div key={o.id} className="p-3 rounded-2xl" style={{ background: "#1F2937" }}>
              <div className="flex items-center justify-between mb-1">
                <div className="font-bold text-white text-sm">{o.id} • {o.customer}</div>
                <span className="text-xs text-gray-400">{o.time}</span>
              </div>
              <div className="text-gray-400 text-xs mb-2">{o.items}</div>
              <div className="flex items-center justify-between">
                <span className="font-black text-base" style={{ color: theme.primary }}>₹{o.total}</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-green-600">Accept</button>
                  <button className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: "#374151", color: "#EF4444" }}>Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "menu" && (
        <div className="px-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-bold">Menu Items</h3>
            <button className="text-xs font-bold px-3 py-1.5 rounded-xl text-white" style={{ background: theme.primary }}>
              + Add Item
            </button>
          </div>
          {menuItems.slice(0, 4).map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "#1F2937" }}>
              <span className="text-3xl">{item.emoji}</span>
              <div className="flex-1">
                <div className="text-white font-bold text-sm">{item.name}</div>
                <div className="text-gray-400 text-xs">₹{item.price} • {item.calories} kcal</div>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-400 text-xs">Edit</button>
                <button className="text-red-400 text-xs">Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "analytics" && (
        <div className="px-4">
          <div className="p-4 rounded-2xl mb-3" style={{ background: "#1F2937" }}>
            <h3 className="text-white font-bold mb-3">Weekly Revenue</h3>
            <div className="flex items-end gap-2 h-24">
              {[2400, 1800, 3200, 2900, 3800, 4100, 3240].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg"
                    style={{ height: `${(v / 4100) * 80}px`, background: i === 6 ? theme.primary : "#374151" }} />
                  <span className="text-xs text-gray-600">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Top Item", value: "Fish Curry", sub: "42 orders" },
              { label: "Peak Hour", value: "12–2 PM", sub: "Lunch rush" },
              { label: "Avg Order", value: "₹156", sub: "This week" },
              { label: "Rating", value: "4.8 ⭐", sub: "124 reviews" },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-2xl" style={{ background: "#1F2937" }}>
                <div className="text-gray-500 text-xs">{s.label}</div>
                <div className="text-white font-black text-base mt-0.5">{s.value}</div>
                <div className="text-gray-500 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// DELIVERY DASHBOARD
// ============================================================
function DeliveryDashboard({ setView }) {
  const [online, setOnline] = useState(true);
  const [tab, setTab] = useState("active");

  return (
    <div className="pb-24" style={{ background: "#0D1117", minHeight: "100vh", color: "#F9FAFB" }}>
      <div className="px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: "rgba(13,17,23,0.97)" }}>
        <button onClick={() => setView("app")} className="text-2xl">←</button>
        <div className="flex-1">
          <h1 className="font-black text-white text-xl">Delivery Partner</h1>
          <p className="text-xs text-gray-400">Bikash Sharma • #BP001</p>
        </div>
        <button
          onClick={() => setOnline(!online)}
          className="px-3 py-1.5 rounded-full text-xs font-bold"
          style={{ background: online ? "#10B981" : "#374151", color: "white" }}
        >
          {online ? "● Online" : "○ Offline"}
        </button>
      </div>

      {/* Earnings */}
      <div className="px-4 my-4">
        <div className="p-4 rounded-2xl"
          style={{ background: "linear-gradient(135deg, #FF6B00, #FF3D00)" }}>
          <div className="text-white/80 text-xs">Today's Earnings</div>
          <div className="text-white font-black text-4xl mt-1">₹847</div>
          <div className="flex gap-4 mt-3">
            <div><div className="text-white font-bold">12</div><div className="text-white/70 text-xs">Deliveries</div></div>
            <div><div className="text-white font-bold">34 km</div><div className="text-white/70 text-xs">Traveled</div></div>
            <div><div className="text-white font-bold">4.9 ⭐</div><div className="text-white/70 text-xs">Rating</div></div>
          </div>
        </div>
      </div>

      {/* Active Order */}
      {online && (
        <div className="px-4 mb-4">
          <div className="p-4 rounded-2xl" style={{ background: "#1F2937", border: "1px solid rgba(255,107,0,0.3)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold" style={{ color: theme.primary }}>ACTIVE ORDER • FX200</div>
              <span className="text-xs text-yellow-400">⏱ Pick up by 2:15 PM</span>
            </div>
            <div className="font-bold text-white">Pickup: Maa Kitchen</div>
            <div className="text-gray-400 text-xs mb-1">Near Market, Jagiroad</div>
            <div className="w-full h-px bg-gray-700 my-2" />
            <div className="font-bold text-white">Deliver to: Hostel Block A, Rm 204</div>
            <div className="text-gray-400 text-xs mb-3">0.8 km away</div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-xl font-bold text-sm text-white bg-green-600">Navigate 🗺️</button>
              <button className="flex-1 py-2 rounded-xl font-bold text-sm" style={{ background: "#374151", color: "#F9FAFB" }}>
                Call 📞
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Stats */}
      <div className="px-4">
        <h3 className="text-white font-bold mb-3">This Week</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total Earned", value: "₹4,280" },
            { label: "Deliveries", value: "67" },
            { label: "Avg Rating", value: "4.9 ⭐" },
            { label: "On-time %", value: "98%" },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-2xl text-center" style={{ background: "#1F2937" }}>
              <div className="font-black text-white text-xl">{s.value}</div>
              <div className="text-gray-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN PANEL
// ============================================================
function AdminPanel({ setView }) {
  const [tab, setTab] = useState("overview");

  return (
    <div className="pb-24" style={{ background: "#0D1117", minHeight: "100vh", color: "#F9FAFB" }}>
      <div className="px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: "rgba(13,17,23,0.97)" }}>
        <button onClick={() => setView("app")} className="text-2xl">←</button>
        <div>
          <h1 className="font-black text-white text-xl">Admin CMS</h1>
          <p className="text-xs text-orange-400">FoodoraX Control Center</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 pt-3 pb-2 overflow-x-auto">
        {["overview", "users", "restaurants", "orders", "analytics"].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold capitalize"
            style={{ background: tab === t ? theme.primary : "#1F2937", color: tab === t ? "white" : "#6B7280" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="px-4 mt-2">
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: "Total Users", value: "2,847", icon: "👥", change: "+124 today" },
              { label: "Active Orders", value: "38", icon: "📦", change: "Live now" },
              { label: "Restaurants", value: "24", icon: "🏪", change: "12 online" },
              { label: "Revenue", value: "₹1.2L", icon: "💰", change: "This month" },
              { label: "Delivery Partners", value: "18", icon: "🛵", change: "14 online" },
              { label: "Avg Rating", value: "4.7 ★", icon: "⭐", change: "Platform avg" },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-2xl" style={{ background: "#1F2937" }}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-black text-white text-xl">{s.value}</div>
                <div className="text-gray-500 text-xs">{s.label}</div>
                <div className="text-green-400 text-xs font-semibold">{s.change}</div>
              </div>
            ))}
          </div>

          {/* FoodoraX Air Architecture Preview */}
          <div className="p-4 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #0c0c1d, #1a1a3e)", border: "1px solid rgba(99,102,241,0.4)" }}>
            <div className="text-xs font-bold mb-2" style={{ color: "#818CF8" }}>🚁 FOODORAX AIR — FUTURE ARCHITECTURE</div>
            <div className="text-white font-bold text-sm mb-2">Drone Delivery System</div>
            <div className="text-gray-400 text-xs mb-3">Database schemas ready. APIs designed. Awaiting regulatory approval.</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { table: "drones", status: "Schema Ready" },
                { table: "drone_routes", status: "Schema Ready" },
                { table: "pickup_zones", status: "Schema Ready" },
                { table: "battery_status", status: "Schema Ready" },
              ].map((t) => (
                <div key={t.table} className="p-2 rounded-xl" style={{ background: "rgba(99,102,241,0.1)" }}>
                  <div className="text-xs text-indigo-300 font-mono">{t.table}</div>
                  <div className="text-xs text-green-400 mt-0.5">✓ {t.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="px-4 mt-2 flex flex-col gap-3">
          {[
            { name: "Rahul Bora", email: "rahul@college.edu", orders: 24, status: "active", type: "Student" },
            { name: "Priya Devi", email: "priya@hostel.edu", orders: 18, status: "active", type: "Student" },
            { name: "Amit Saikia", email: "amit@email.com", orders: 7, status: "active", type: "Regular" },
            { name: "Bikash Roy", email: "bikash@email.com", orders: 45, status: "active", type: "Premium" },
          ].map((u, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "#1F2937" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                style={{ background: theme.primary }}>
                {u.name[0]}
              </div>
              <div className="flex-1">
                <div className="text-white font-bold text-sm">{u.name}</div>
                <div className="text-gray-500 text-xs">{u.email}</div>
              </div>
              <div className="text-right">
                <span className="text-xs px-2 py-0.5 rounded-full font-bold text-white"
                  style={{ background: u.type === "Premium" ? "#8B5CF6" : u.type === "Student" ? theme.primary : "#374151" }}>
                  {u.type}
                </span>
                <div className="text-gray-500 text-xs mt-1">{u.orders} orders</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "restaurants" && (
        <div className="px-4 mt-2 flex flex-col gap-3">
          {restaurants.map((r) => (
            <div key={r.id} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "#1F2937" }}>
              <div className="text-3xl">{r.image}</div>
              <div className="flex-1">
                <div className="text-white font-bold text-sm">{r.name}</div>
                <div className="text-gray-400 text-xs">{r.cuisine}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-green-400 font-bold">● Active</div>
                <StarRating rating={r.rating} />
              </div>
            </div>
          ))}
          <button className="w-full py-3 rounded-2xl font-bold text-white text-sm"
            style={{ background: theme.primary }}>
            + Onboard Restaurant
          </button>
        </div>
      )}

      {tab === "orders" && (
        <div className="px-4 mt-2 flex flex-col gap-3">
          {[
            { id: "FX200", customer: "Rahul B.", restaurant: "Maa Kitchen", total: 218, status: "delivering", time: "5 min" },
            { id: "FX201", customer: "Priya D.", restaurant: "Chai Adda", total: 87, status: "preparing", time: "12 min" },
            { id: "FX202", customer: "Amit S.", restaurant: "Student Bites", total: 147, status: "placed", time: "2 min" },
          ].map((o) => (
            <div key={o.id} className="p-3 rounded-2xl" style={{ background: "#1F2937" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-bold text-sm">{o.id}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  o.status === "delivering" ? "bg-green-900 text-green-400" :
                  o.status === "preparing" ? "bg-orange-900 text-orange-400" :
                  "bg-blue-900 text-blue-400"
                }`}>{o.status}</span>
              </div>
              <div className="text-gray-400 text-xs">{o.customer} • {o.restaurant}</div>
              <div className="flex justify-between mt-1">
                <span className="font-black" style={{ color: theme.primary }}>₹{o.total}</span>
                <span className="text-gray-500 text-xs">ETA: {o.time} ago</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "analytics" && (
        <div className="px-4 mt-2">
          <div className="p-4 rounded-2xl mb-3" style={{ background: "#1F2937" }}>
            <h3 className="text-white font-bold mb-3">Monthly Revenue</h3>
            <div className="flex items-end gap-1.5 h-24">
              {[45000, 62000, 58000, 75000, 89000, 120000].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg"
                    style={{ height: `${(v / 120000) * 80}px`, background: i === 5 ? theme.primary : "#374151" }} />
                  <span className="text-xs text-gray-600">
                    {["N", "D", "J", "F", "M", "A"][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-green-400 font-bold">↑ 34% growth this month</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total GMV", value: "₹4.49L" },
              { label: "Platform Fee", value: "₹44.9K" },
              { label: "Avg Order Val", value: "₹156" },
              { label: "Reorder Rate", value: "68%" },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-2xl text-center" style={{ background: "#1F2937" }}>
                <div className="font-black text-white text-xl">{s.value}</div>
                <div className="text-gray-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// LANDING PAGE
// ============================================================
function LandingPage({ setView }) {
  return (
    <div style={{ background: "#0D1117", minHeight: "100vh", color: "#F9FAFB" }}>
      {/* Nav */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="font-black text-2xl tracking-tighter"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          FoodoraX
        </div>
        <div className="flex gap-3">
          <button className="text-sm text-gray-400">About</button>
          <button
            className="text-sm font-bold px-4 py-2 rounded-xl text-white"
            style={{ background: theme.primary }}
            onClick={() => setView("app")}
          >
            Order Now
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-bold"
          style={{ background: "rgba(255,107,0,0.15)", border: "1px solid rgba(255,107,0,0.3)", color: theme.primary }}>
          🚀 Now Live in Jagiroad, Assam
        </div>
        <h1 className="font-black text-5xl leading-tight mb-4">
          <span className="text-white">Jagiroad's</span><br />
          <span style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Own Food App
          </span>
        </h1>
        <p className="text-gray-400 text-base max-w-xs mx-auto mb-8">
          Authentic Assamese food, student combos & gym meals — delivered to your hostel in minutes.
        </p>
        <button
          className="px-8 py-4 rounded-2xl font-black text-white text-lg"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}
          onClick={() => setView("app")}
        >
          Start Ordering 🍔
        </button>
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
          <div><span className="font-bold text-white">2,847+</span> users</div>
          <div><span className="font-bold text-white">24</span> restaurants</div>
          <div><span className="font-bold text-white">₹49</span> meals</div>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 py-8" style={{ background: "#111827" }}>
        <h2 className="font-black text-white text-2xl text-center mb-6">Built for Jagiroad 🏡</h2>
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {[
            { icon: "🎓", title: "Student Combos", desc: "₹49 meals for students" },
            { icon: "🍚", title: "Assamese Food", desc: "Authentic local cuisine" },
            { icon: "💪", title: "Gym Meals", desc: "High-protein, healthy" },
            { icon: "⚡", title: "Fast Delivery", desc: "20–30 min delivery" },
            { icon: "🏠", title: "Hostel Delivery", desc: "Right to your room" },
            { icon: "🚁", title: "Air Delivery", desc: "Coming soon: Drones!" },
          ].map((f) => (
            <div key={f.title} className="p-4 rounded-2xl" style={{ background: "#1F2937" }}>
              <div className="text-3xl mb-2">{f.icon}</div>
              <div className="text-white font-bold text-sm">{f.title}</div>
              <div className="text-gray-500 text-xs mt-0.5">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Preview */}
      <div className="px-6 py-8">
        <h2 className="font-black text-white text-xl text-center mb-4">Enterprise Tech Stack</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {["Next.js 15", "React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Prisma ORM", "Socket.io", "Razorpay", "JWT Auth", "Cloudinary", "Redis", "Docker", "Vercel"].map((t) => (
            <span key={t} className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ background: "#1F2937", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.06)" }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* DB Schema Preview */}
      <div className="px-6 py-4"
        style={{ background: "#0D1117", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <h2 className="font-black text-white text-sm mb-3 font-mono">📦 Database Architecture (Prisma)</h2>
        <div className="p-4 rounded-2xl overflow-x-auto" style={{ background: "#161B22" }}>
          <pre className="text-xs font-mono" style={{ color: "#58A6FF" }}>
{`// Prisma Schema — FoodoraX
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  phone     String?
  role      Role     @default(CUSTOMER)
  orders    Order[]
  addresses Address[]
  createdAt DateTime @default(now())
}

model Restaurant {
  id           String     @id @default(cuid())
  name         String
  cuisine      String
  rating       Float      @default(0)
  isActive     Boolean    @default(true)
  menuItems    MenuItem[]
  orders       Order[]
}

model Order {
  id         String      @id @default(cuid())
  userId     String
  user       User        @relation(fields: [userId], references: [id])
  status     OrderStatus @default(PLACED)
  total      Float
  items      OrderItem[]
  payment    Payment?
  createdAt  DateTime    @default(now())
}

// FoodoraX Air — Future Drone System
model Drone {
  id          String   @id @default(cuid())
  serialNo    String   @unique
  status      DroneStatus @default(IDLE)
  batteryPct  Float
  maxPayload  Float
  routes      DroneRoute[]
  deliveries  DroneDelivery[]
}

model DroneDelivery {
  id         String   @id @default(cuid())
  droneId    String
  orderId    String
  pickupZone String
  dropZone   String
  status     DroneDeliveryStatus
  eta        DateTime?
}

enum Role { CUSTOMER RESTAURANT DELIVERY ADMIN }
enum OrderStatus { PLACED CONFIRMED PREPARING OUT_FOR_DELIVERY DELIVERED }
enum DroneStatus { IDLE FLYING CHARGING MAINTENANCE }`}
          </pre>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-8 text-center" style={{ background: "#111827" }}>
        <div className="font-black text-2xl mb-2"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          FoodoraX
        </div>
        <p className="text-gray-500 text-xs">Jagiroad's Own Smart Food Delivery Platform</p>
        <p className="text-gray-600 text-xs mt-2">Built with ❤️ for Assam • MVP v1.0</p>
        <div className="flex justify-center gap-4 mt-4 text-xs text-gray-600">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Contact</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function FoodoraX() {
  const [view, setView] = useState("landing"); // landing | app | restaurant | delivery | admin
  const [page, setPage] = useState("home");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  if (view === "landing") return <LandingPage setView={setView} />;
  if (view === "restaurant") return <RestaurantDashboard setView={setView} />;
  if (view === "delivery") return <DeliveryDashboard setView={setView} />;
  if (view === "admin") return <AdminPanel setView={setView} />;

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", position: "relative" }}>
      {/* Pages */}
      {page === "home" && (
        <HomePage
          setPage={setPage}
          setSelectedRestaurant={setSelectedRestaurant}
          cart={cart}
          setCart={setCart}
        />
      )}
      {page === "search" && (
        <SearchPage setPage={setPage} setSelectedRestaurant={setSelectedRestaurant} />
      )}
      {page === "restaurant" && selectedRestaurant && (
        <RestaurantPage
          restaurant={selectedRestaurant}
          setPage={setPage}
          cart={cart}
          setCart={setCart}
        />
      )}
      {page === "cart" && (
        <CartPage cart={cart} setCart={setCart} setPage={setPage} />
      )}
      {page === "ordertrack" && (
        <OrderTrackPage setPage={setPage} setCart={setCart} />
      )}
      {page === "orders" && (
        <OrdersPage setPage={setPage} />
      )}
      {page === "profile" && (
        <ProfilePage setPage={setPage} setView={setView} />
      )}

      {/* Bottom Nav */}
      {page !== "ordertrack" && (
        <BottomNav page={page} setPage={setPage} cartCount={cartCount} />
      )}
    </div>
  );
}
