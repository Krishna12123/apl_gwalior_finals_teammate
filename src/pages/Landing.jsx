import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { motion } from "framer-motion";
import { 
  Sparkles, CheckCircle2, FileText, Search, ArrowRight, TrendingUp
} from "lucide-react";

export default function Landing() {
  const { user } = useApp();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15 } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="flex-1 bg-mesh-gradient dark:bg-mesh-dark min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-16 sm:py-24 relative overflow-hidden"
        >
          {/* Decorative Glow Elements */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-500/20 dark:bg-brand-500/10 blur-[80px] rounded-full -z-10 animate-pulse-slow" />
          <div className="absolute bottom-10 left-1/3 w-48 h-48 bg-blue-500/20 dark:bg-blue-500/10 blur-[60px] rounded-full -z-10 animate-float" />

          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider mb-6 border border-brand-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Discovery Engine
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white leading-none max-w-4xl mx-auto mb-6">
            Discover Government Schemes You Qualify For,{" "}
            <span className="bg-gradient-to-r from-brand-600 to-blue-600 dark:from-brand-400 dark:to-blue-400 bg-clip-text text-transparent">
              Instantly.
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop searching through outdated government portals. Input your profile, and let our AI eligibility engine match you with scholarships, business loans, and welfare benefits.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to={user ? "/dashboard" : "/profile"}
              className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-600 to-blue-600 text-white font-semibold rounded-2xl shadow-lg shadow-brand-500/20 hover:shadow-xl hover:shadow-brand-500/30 hover:opacity-95 transform active:scale-95 transition-all text-base"
            >
              {user ? "Go to Dashboard" : "Find Your Schemes"}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white/70 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-semibold rounded-2xl backdrop-blur-sm transition-all text-base"
            >
              How it Works
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-20 pt-10 border-t border-slate-200/50 dark:border-slate-800/30">
            {[
              { val: "₹3,000 Cr+", label: "Unclaimed Benefits" },
              { val: "12+", label: "High-Value Schemes" },
              { val: "< 2s", label: "Matching Latency" },
              { val: "100% Free", label: "Open Access" }
            ].map((m, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white bg-gradient-to-tr from-brand-600 to-blue-600 dark:from-brand-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {m.val}
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <section id="features" className="py-20 border-t border-slate-200/50 dark:border-slate-800/30">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4">
              Everything you need for easy application
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              We translate confusing government legal jargon into simple checklists and personalized step-by-step guides.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 text-left relative overflow-hidden">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-3">
                Smart Eligibility Matcher
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Matches your age, state, category, and income with live rules. Filters out irrelevant options so you only see what you actually qualify for.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 text-left relative overflow-hidden">
              <div className="h-12 w-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-3">
                AI Recommendation Summary
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Uses Gemini to read your profile and summarize the most beneficial options in natural, citizen-friendly language. No more complex jargon.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 text-left relative overflow-hidden">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-3">
                Structured Application Guidance
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Shows you exactly what documents (Aadhaar, income proof, certificates) are required, and provides a clear, step-by-step submission checklist.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Dynamic AI Advisor Highlight */}
        <section className="py-12 bg-white/40 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/30 rounded-3xl p-8 sm:p-12 mb-20 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-brand-600/10 blur-[80px] rounded-full -z-10" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wider uppercase mb-4 border border-blue-500/20">
                <TrendingUp className="h-3.5 w-3.5" />
                Retrieval-Augmented Generation (RAG)
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white mb-4">
                Chat with our AI Scheme Advisor
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Ask specific questions like *"What documents do I need to apply for the student scholarship?"* or *"Can I apply for farming loans if I live in MP?"*. 
                The chatbot uses RAG to ground its answers in our structured scheme database, ensuring 100% factual replies without hallucinations.
              </p>
              <ul className="space-y-3">
                {[
                  "Factual answers grounded directly in scheme databases",
                  "Personalized insights based on your age and income",
                  "Interactive quick-prompts to begin questions immediately"
                ].map((txt, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400 shrink-0" />
                    {txt}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-2xl shadow-xl border border-slate-800 relative font-mono text-xs text-slate-400">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-brand-500 animate-ping" />
                  Live Chat Simulation
                </span>
                <span className="text-[10px] text-slate-600">v2.5-flash</span>
              </div>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="text-brand-400 shrink-0">user:</span>
                  <span>Which schemes can I apply for? I'm an 18y/o OBC student in MP.</span>
                </div>
                <div className="flex gap-2 text-slate-300 border-l-2 border-brand-500 pl-2 py-1">
                  <span className="text-blue-400 shrink-0">assistant:</span>
                  <div>
                    Based on your profile, you qualify for 3 schemes:
                    <ol className="list-decimal pl-4 mt-1 space-y-1">
                      <li><span className="text-emerald-400 font-semibold">Post Matric Scholarship for OBC</span>: reimburses 100% tuition fees.</li>
                      <li><span className="text-emerald-400 font-semibold">PM Vidyalaxmi Loan</span>: low interest rates up to ₹20L.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400 dark:text-slate-500 py-6 border-t border-slate-200/50 dark:border-slate-800/30">
          SchemeAI is an independent citizen advisory tool. It is not affiliated with the Government of India or any state ministries.
        </div>
      </div>
    </div>
  );
}
