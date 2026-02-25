"use client";

import { useState, useEffect } from "react";

type TravelItem = {
  id: number;
  title: string;
  location: string;
  price: number;
  tags: string[];
  image: string;
  reason?: string;
};

export default function Home() {
  const [results, setResults] = useState<TravelItem[]>([]);
  const [allItems, setAllItems] = useState<TravelItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [activeTab, setActiveTab] = useState<string>("all");
  const [negativeBudget, setNegativeBudget] = useState(false);
  const [sortBy, setSortBy] = useState<{
    key: "price" | "name";
    ascending: boolean;
  }>({ key: "price", ascending: true });

  const formatUSD = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(v);

  const loadAllItems = async () => {
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "" }),
      });

      const data = await res.json();
      setResults(data.results || []);
      setAllItems(data.results || []);
      setNegativeBudget(false);
    } catch (err) {
      console.error(err);
    }
  };

  const searchTrips = async (customQuery?: string) => {
    setLoading(true);

    const min = Number(priceFilter.min);
    const max = Number(priceFilter.max);

    if ((priceFilter.min && min < 0) || (priceFilter.max && max < 0)) {
      setResults([]);
      setNegativeBudget(true);
      setLoading(false);
      return;
    } else {
      setNegativeBudget(false);
    }

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: customQuery ?? query,
          minPrice: priceFilter.min ? min : null,
          maxPrice: priceFilter.max ? max : null,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = async (tab: string) => {
    setActiveTab(tab);
    setQuery("");
    setPriceFilter({ min: "", max: "" });
    setNegativeBudget(false);
    await searchTrips(tab === "all" ? "" : tab);
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy.key === "price") {
      return sortBy.ascending ? a.price - b.price : b.price - a.price;
    }
    return sortBy.ascending
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  });

  useEffect(() => {
    const id = setTimeout(() => {
      if (query || priceFilter.min || priceFilter.max) {
        searchTrips();
      }
    }, 500);
    return () => clearTimeout(id);
  }, [query, priceFilter]);

  useEffect(() => {
    loadAllItems();
  }, []);

  const handleResetClick = () => {
    setQuery("");
    setPriceFilter({ min: "", max: "" });
    setSortBy({ key: "price", ascending: true });
    setActiveTab("all");
    loadAllItems();
  };

  return (
    <div className="min-h-screen bg-[#F5EDEB] p-1 sm:p-2 md:p-3 lg:p-4 xl:px-8 2xl:px-12">
      <div className="text-center mb-4 sm:mb-6 lg:mb-8 w-full px-4 sm:px-6 lg:px-0 max-w-none">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent mb-2 sm:mb-3 leading-tight">
          Explore Dream Destinations
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-slate-800 font-medium w-full max-w-4xl mx-auto leading-tight px-2 sm:px-0">
          Discover perfect adventures with AI-powered search
        </p>
      </div>
      <div className="sticky top-1 sm:top-2 z-50 mb-4 sm:mb-6 lg:mb-8 w-full px-4 sm:px-6 lg:px-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 sm:gap-3 max-w-none lg:max-w-7xl mx-auto">
          {[
            { id: "all", label: "All", icon: "🌟" },
            { id: "beach", label: "Beach", icon: "🏖️" },
            { id: "hiking", label: "Hiking", icon: "🥾" },
            { id: "history", label: "History", icon: "🏛️" },
            { id: "nature", label: "Nature", icon: "🌿" },
            { id: "adventure", label: "Adventure", icon: "🧗" },
            { id: "animals", label: "Wildlife", icon: "🐘" },
            { id: "culture", label: "Culture", icon: "🎭" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`group relative flex flex-col items-center gap-1 sm:gap-1.5 p-2 sm:p-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-500 overflow-hidden backdrop-blur-xl shadow-lg flex-1 ${
                activeTab === tab.id
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-2xl shadow-emerald-500/50 scale-105 border-2 border-emerald-400"
                  : "bg-white/80 hover:bg-white text-slate-900 hover:shadow-xl hover:shadow-emerald-300/30 hover:scale-102 hover:border-emerald-300/50 border-2 border-slate-200/50 backdrop-blur-xl"
              }`}
            >
              <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">
                {tab.icon}
              </span>
              <span className="tracking-wide leading-tight min-w-0 truncate">
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/50 to-transparent animate-pulse rounded-2xl -z-10" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 mb-6 lg:mb-8 sm:mb-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/50 shadow-2xl shadow-slate-100/50">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 items-end">
            <div className="lg:col-span-2 xl:col-span-3 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                <svg
                  className="w-5 sm:w-6 h-5 sm:h-6 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchTrips()}
                placeholder="Search beach under $100, hiking adventures, history tours..."
                className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 text-lg sm:text-xl bg-white border-2 border-slate-200/60 hover:border-emerald-400/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 rounded-3xl font-semibold shadow-inner transition-all duration-300 outline-none text-slate-900 placeholder-slate-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="relative group">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceFilter.min}
                  onChange={(e) =>
                    setPriceFilter({ ...priceFilter, min: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white border-2 border-slate-200/60 hover:border-emerald-400/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 rounded-2xl font-semibold text-base sm:text-lg shadow-inner transition-all duration-300 outline-none text-slate-900 placeholder-slate-500 group-hover:shadow-lg"
                />
                <div className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 bg-emerald-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold animate-pulse">
                  $
                </div>
              </div>
              <div className="relative group">
                <input
                  type="number"
                  placeholder="Max"
                  value={priceFilter.max}
                  onChange={(e) =>
                    setPriceFilter({ ...priceFilter, max: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white border-2 border-slate-200/60 hover:border-emerald-400/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 rounded-2xl font-semibold text-base sm:text-lg shadow-inner transition-all duration-300 outline-none text-slate-900 placeholder-slate-500 group-hover:shadow-lg"
                />
                <div className="absolute -top-1.5 sm:-top-2 left-1.5 sm:left-2 bg-emerald-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold animate-pulse">
                  $
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 sm:py-24 lg:py-32 space-y-4">
              <div className="w-16 sm:w-20 h-16 sm:h-20 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                AI Finding Perfect Matches...
              </div>
            </div>
          ) : sortedResults.length > 0 ? (
            sortedResults.map((item, index) => (
              <div
                key={item.id}
                className="group relative bg-white/90 backdrop-blur-xl rounded-3xl p-2 sm:p-3 border border-slate-200/50 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-700 overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-white aspect-[4/3] mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-700">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-700"
                  />
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/95 backdrop-blur-xl px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl shadow-lg border">
                    <span className="text-emerald-600 font-bold text-xs sm:text-sm tracking-wide">
                      {formatUSD(item.price)}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 p-2 sm:p-3 lg:p-5 space-y-1 sm:space-y-2">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-slate-700 font-semibold text-sm sm:text-base lg:text-lg">
                    {item.location}
                  </p>

                  {item.reason && (
                    <div className="bg-emerald-50/80 p-2 sm:p-3 rounded-2xl border border-emerald-200/50 backdrop-blur-sm">
                      <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                        {item.reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 sm:py-24 lg:py-32 text-center space-y-4 sm:space-y-6 bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-2xl">
              <div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-2 sm:mb-4">
                  No Adventures Found
                </h2>
                <p className="text-lg sm:text-xl lg:text-2xl text-slate-700 font-semibold mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                  {negativeBudget
                    ? "Budget cannot be negative. Please enter valid amounts."
                    : 'Try "beach under $100", "hiking adventures", or explore categories above!'}
                </p>
              </div>
              <button
                onClick={handleResetClick}
                className="group relative px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white rounded-3xl font-black text-base sm:text-lg shadow-2xl hover:shadow-3xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 overflow-hidden backdrop-blur-xl"
              >
                <span>Show All Adventures</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-auto border-t border-emerald-200/50 pt-3 pb-3 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-6 text-xs sm:text-sm">
            <p className="text-slate-800 font-semibold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              © 2026 Dream Destinations. Powered by AI 
            </p>
            <div className="w-16 h-px bg-gradient-to-r from-emerald-300 to-emerald-400"></div>
            <div className="flex gap-4 text-slate-700 font-medium">
              <a
                href="#"
                className="hover:text-emerald-600 hover:scale-105 transition-all duration-200"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-emerald-600 hover:scale-105 transition-all duration-200"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-emerald-600 hover:scale-105 transition-all duration-200"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
