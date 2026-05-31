import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { 
  ArrowLeft, CheckCircle2, XCircle, Landmark, FileText, 
  ClipboardList, HelpCircle, Star, Sparkles, Send, ExternalLink
} from "lucide-react";

export default function SchemeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, schemes, savedSchemes, toggleSaveScheme } = useApp();

  const scheme = schemes.find((s) => s.schemeId === id);

  if (!scheme) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
        <HelpCircle className="h-12 w-12 text-slate-400 mb-2" />
        <h3 className="text-lg font-bold">Scheme not found</h3>
        <Link to="/dashboard" className="text-brand-600 mt-2 text-sm">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isSaved = savedSchemes.includes(scheme.schemeId);

  // Compute validation results for the eligibility checklist
  const validations = [
    {
      label: `Age requirement: ${scheme.ageMin} to ${scheme.ageMax} years`,
      passed: profile.age >= scheme.ageMin && profile.age <= scheme.ageMax,
      userVal: `${profile.age} years old`
    },
    {
      label: `Income requirement: Max ₹${scheme.incomeLimit.toLocaleString()}/year`,
      passed: profile.income <= scheme.incomeLimit,
      userVal: `₹${profile.income.toLocaleString()}/year`
    },
    {
      label: `Category requirement: ${scheme.category.join(", ")}`,
      passed: scheme.category.includes("Any") || scheme.category.includes(profile.category),
      userVal: profile.category
    },
    {
      label: `Domicile requirement: ${scheme.state === "All" ? "All States Eligible" : scheme.state}`,
      passed: scheme.state === "All" || scheme.state === profile.state,
      userVal: profile.state
    },
    {
      label: `Occupation requirement: ${scheme.occupation.join(", ")}`,
      passed: scheme.occupation.includes("Any") || scheme.occupation.includes("All") || scheme.occupation.includes(profile.occupation),
      userVal: profile.occupation
    },
    {
      label: `Disability requirement: ${scheme.disabilityRequired ? "Yes" : "Any status"}`,
      passed: !scheme.disabilityRequired || profile.disabilityStatus === true,
      userVal: profile.disabilityStatus ? "Yes (Divyangjan)" : "No"
    }
  ];

  return (
    <div className="flex-1 bg-slate-50 dark:bg-[#0b0f19] py-8 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation and Bookmarking */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          
          <button
            onClick={() => toggleSaveScheme(scheme.schemeId)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
              isSaved 
                ? "bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-sm" 
                : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
            }`}
          >
            <Star className={`h-4.5 w-4.5 ${isSaved ? "fill-amber-500" : ""}`} />
            {isSaved ? "Saved to Bookmarks" : "Save Scheme"}
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Core Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="space-y-4">
                <span className="text-xs uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  {scheme.state === "All" ? "Central Government" : `${scheme.state} State`}
                </span>
                
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                  {scheme.name}
                </h2>
                
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {scheme.description}
                </p>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5">
                    <Landmark className="h-4 w-4" /> Benefits Offered
                  </h4>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {scheme.benefits}
                  </p>
                </div>
              </div>
            </div>

            {/* Eligibility Breakdown Checklist */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                Eligibility Breakdown
              </h3>
              
              <div className="divide-y divide-slate-100 dark:divide-slate-850">
                {validations.map((v, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-slate-400 dark:text-slate-500">Constraint</span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                        {v.label}
                      </span>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-2">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-400">Your profile</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{v.userVal}</span>
                      </div>
                      {v.passed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-rose-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application steps */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                Step-by-Step Application Guide
              </h3>

              <div className="relative border-l-2 border-slate-150 dark:border-slate-800 ml-3.5 pl-6 space-y-6 py-2">
                {scheme.applicationSteps.map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Node Dot */}
                    <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-brand-500 bg-white dark:bg-slate-900 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                    </div>
                    
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Step {idx + 1}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar: Documents & AI Help */}
          <div className="space-y-6">
            
            {/* Required Documents */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                Required Documents
              </h3>
              
              <ul className="space-y-3">
                {scheme.documents.map((docName, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-350 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-xl">
                    <CheckCircle2 className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400 shrink-0" />
                    {docName}
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Advisor Panel */}
            <div className="bg-gradient-to-tr from-brand-600/90 to-indigo-600/95 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 blur-[30px] rounded-full" />
              
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-wider mb-4">
                <Sparkles className="h-3 w-3" />
                AI Assistant
              </div>
              
              <h3 className="font-heading font-bold text-lg mb-2">Need application help?</h3>
              <p className="text-xs text-brand-100/90 mb-6 leading-relaxed">
                Our AI Advisor understands all document requirements, FAQs, and step-by-step instructions for this program.
              </p>

              <Link
                to={`/chat?query=${encodeURIComponent(`Tell me more about ${scheme.name} and how I can apply.`)}`}
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-white text-brand-650 hover:bg-slate-50 font-bold rounded-xl text-xs transition-all shadow-md"
              >
                Ask Assistant about this Scheme
                <Send className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Apply Button Portal Link */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                Official Application Portal
              </h3>
              <p className="text-[11px] text-slate-500 mb-4">
                Apply directly on the secure Central/State portal. Make sure you have your digital documents ready.
              </p>
              
              <a
                href={scheme.applyLink}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-slate-900 hover:bg-slate-850 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-50 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
              >
                Go to Official Site
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
