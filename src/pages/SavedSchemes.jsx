import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, Bookmark, ArrowRight, Landmark, Briefcase, Calendar 
} from "lucide-react";

export default function SavedSchemes() {
  const { schemes, savedSchemes, toggleSaveScheme } = useApp();

  const bookmarked = schemes.filter((s) => savedSchemes.includes(s.schemeId));

  return (
    <div className="flex-1 bg-slate-50 dark:bg-[#0b0f19] py-8 px-4 sm:px-6 lg:px-8 text-left animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Block */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl shadow-sm">
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white m-0">
            Saved Schemes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and apply for the schemes you bookmarked for later.
          </p>
        </div>

        {/* Bookmarked Grid */}
        <AnimatePresence mode="popLayout">
          {bookmarked.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarked.map((scheme) => (
                <motion.div
                  key={scheme.schemeId}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card rounded-3xl p-6 flex flex-col justify-between h-[285px] hover:border-brand-500/30 dark:hover:border-brand-400/30 group relative"
                >
                  <div>
                    {/* Header Card */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {scheme.state === "All" ? "Central Scheme" : scheme.state}
                      </span>
                      
                      <button
                        onClick={() => toggleSaveScheme(scheme.schemeId)}
                        className="p-1.5 rounded-lg border bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20"
                        title="Remove bookmark"
                      >
                        <Star className="h-4 w-4 fill-amber-500" />
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

                  {/* Metadata and button */}
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
                      className="w-full flex items-center justify-center gap-1 py-2 bg-slate-900 hover:bg-slate-855 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-all"
                    >
                      Complete Steps
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-lg mx-auto shadow-sm"
            >
              <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-4">
                <Bookmark className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white mb-2">
                No saved schemes yet
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Bookmarked schemes will show up here. Explore recommendations and save programs you want to track or apply to.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-semibold hover:opacity-95"
              >
                Find Schemes to Save
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
