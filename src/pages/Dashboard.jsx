import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getAiSummary, getGeminiApiKey } from "../services/gemini";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Sparkles, ArrowRight, HelpCircle, 
  Landmark, Briefcase, Calendar, Star, SlidersHorizontal
} from "lucide-react";

export default function Dashboard() {
  const { 
    profile, 
    eligibleSchemes, 
    savedSchemes, 
    toggleSaveScheme, 
    addSearchQuery
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  // AI Summary State
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  // Load AI Recommendation Summary on mount or when profile/eligible schemes list changes
  useEffect(() => {
    let active = true;
    
    const fetchSummary = async () => {
      if (!profile || eligibleSchemes.length === 0) {
        setAiSummary("");
        return;
      }
      
      setAiLoading(true);
      setAiError(false);
      
      try {
        const summary = await getAiSummary(profile, eligibleSchemes);
        if (active) {
          // Convert some simple markdown bold tags if needed, but react rendering handles standard string
          setAiSummary(summary);
        }
      } catch (err) {
        console.error("Error generating summary:", err);
        if (active) {
          setAiError(true);
        }
      } finally {
        if (active) {
          setAiLoading(false);
        }
      }
    };

    fetchSummary();

    return () => {
      active = false;
    };
  }, [profile, eligibleSchemes]);

  // Formatted categories tags based on actual data
  const filterTags = ["All", "Scholarship", "Loan", "Pension", "Farmer", "Female"];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    addSearchQuery(searchQuery);
  };

  const getFilteredSchemes = () => {
    return eligibleSchemes.filter((scheme) => {
      // 1. Search Query filter
      const matchesSearch = 
        scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.benefits.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Tag filter
      let matchesTag = true;
      if (selectedTag !== "All") {
        const tag = selectedTag.toLowerCase();
        if (tag === "scholarship") {
          matchesTag = scheme.name.toLowerCase().includes("scholarship") || scheme.name.toLowerCase().includes("education") || scheme.name.toLowerCase().includes("vidya");
        } else if (tag === "loan") {
          matchesTag = scheme.name.toLowerCase().includes("loan") || scheme.name.toLowerCase().includes("mudra") || scheme.name.toLowerCase().includes("swavalamban");
        } else if (tag === "pension") {
          matchesTag = scheme.name.toLowerCase().includes("pension");
        } else if (tag === "farmer") {
          matchesTag = scheme.occupation.includes("Farmer") || scheme.name.toLowerCase().includes("kisan");
        } else if (tag === "female") {
          matchesTag = scheme.gender === "Female";
        }
      }

      return matchesSearch && matchesTag;
    });
  };

  const filteredSchemes = getFilteredSchemes();

  // Helper to render formatting in Markdown (crude parser for Bold, Bullet lists)
  const renderAiSummaryMarkdown = (text) => {
    if (!text) return null;
    
    return text.split("\n").map((line, idx) => {
      let content = line;
      
      // Check for headings
      if (content.startsWith("###")) {
        return <h4 key={idx} className="font-heading font-bold text-slate-900 dark:text-white mt-4 mb-2 text-sm">{content.replace("###", "").trim()}</h4>;
      }
      
      // Check for bullet points
      const isBullet = content.startsWith("*") || content.startsWith("-");
      if (isBullet) {
        content = content.substring(1).trim();
      }

      // Parse bold tags **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          parts.push(content.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-semibold text-brand-700 dark:text-brand-300">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
      }

      if (isBullet) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-600 dark:text-slate-300 text-xs my-1">
            {parts.length > 0 ? parts : content}
          </li>
        );
      }

      return (
        <p key={idx} className="text-xs text-slate-600 dark:text-slate-300 my-1 leading-relaxed">
          {parts.length > 0 ? parts : content}
        </p>
      );
    });
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-[#0b0f19] py-8 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl shadow-sm">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white m-0">
              Welcome, {profile.name || "Citizen"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Showing matching schemes based on your eligibility profile.
            </p>
          </div>
          <Link
            to="/profile"
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium rounded-xl text-sm transition-colors flex items-center gap-1.5"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Edit Profile Parameters
          </Link>
        </div>

        {/* AI Recommendations Card */}
        {eligibleSchemes.length > 0 && (
          <div className="relative rounded-3xl border border-brand-500/20 dark:border-brand-500/10 overflow-hidden bg-white dark:bg-slate-900 shadow-md">
            {/* Glowing accent border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-blue-500" />
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider border border-brand-500/20">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  AI Eligibility Summary
                </div>
                {!getGeminiApiKey() && (
                  <span className="text-[10px] text-amber-500 font-medium px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md">
                    Simulated AI
                  </span>
                )}
              </div>

              {aiLoading ? (
                /* Skeleton loader */
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                </div>
              ) : aiError ? (
                <div className="text-sm text-red-500">
                  Failed to load recommendations. Please verify your Gemini API key in settings.
                </div>
              ) : (
                <div className="space-y-1">
                  {renderAiSummaryMarkdown(aiSummary)}
                  
                  <div className="pt-4 flex justify-end">
                    <Link
                      to="/chat"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                      Ask follow-up questions in the Chat Advisor
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search & Categories */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
            {filterTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                  selectedTag === tag
                    ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scheme name, benefit description..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 text-sm shadow-sm"
            />
            <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-slate-400" />
          </form>
        </div>

        {/* Schemes Grid */}
        <AnimatePresence mode="popLayout">
          {filteredSchemes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchemes.map((scheme) => {
                const isSaved = savedSchemes.includes(scheme.schemeId);
                return (
                  <motion.div
                    key={scheme.schemeId}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card rounded-3xl p-6 flex flex-col justify-between h-[280px] hover:border-brand-500/30 dark:hover:border-brand-400/30 group"
                  >
                    <div>
                      {/* Top Header Card */}
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {scheme.state === "All" ? "Central Scheme" : scheme.state}
                        </span>
                        
                        <button
                          onClick={() => toggleSaveScheme(scheme.schemeId)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isSaved 
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-500" 
                              : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 dark:bg-slate-950 dark:border-slate-800"
                          }`}
                          title={isSaved ? "Remove from bookmarks" : "Save scheme"}
                        >
                          <Star className={`h-4 w-4 ${isSaved ? "fill-amber-500" : ""}`} />
                        </button>
                      </div>

                      {/* Title & Desc */}
                      <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {scheme.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                        {scheme.description}
                      </p>
                    </div>

                    {/* Metadata summary & button */}
                    <div>
                      <div className="grid grid-cols-3 gap-2 border-t border-slate-100 dark:border-slate-800 pt-3.5 mb-3.5 text-[10px] text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1 min-w-0">
                          <Briefcase className="h-3 w-3 shrink-0" />
                          <span className="truncate">{scheme.occupation.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-1 min-w-0">
                          <Landmark className="h-3 w-3 shrink-0" />
                          <span className="truncate">₹{(scheme.incomeLimit / 100000).toFixed(1)}L Limit</span>
                        </div>
                        <div className="flex items-center gap-1 min-w-0">
                          <Calendar className="h-3 w-3 shrink-0" />
                          <span className="truncate">Age {scheme.ageMin}-{scheme.ageMax}</span>
                        </div>
                      </div>

                      <Link
                        to={`/schemes/${scheme.schemeId}`}
                        className="w-full flex items-center justify-center gap-1 py-2 bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-all"
                      >
                        Explore Requirements
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-lg mx-auto shadow-sm"
            >
              <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white mb-2">
                No matching schemes found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Based on your current filters and profile, there are no matching schemes. Try resetting search queries or adjusting parameters in your profile.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTag("All");
                }}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-semibold hover:opacity-95"
              >
                Clear Search Filter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
