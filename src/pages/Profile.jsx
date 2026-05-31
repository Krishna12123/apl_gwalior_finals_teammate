import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { motion } from "framer-motion";
import { 
  User, Calendar, Landmark, MapPin, Briefcase, Users, Award, ShieldAlert, Sparkles, CheckCircle2, ChevronRight
} from "lucide-react";

export default function Profile() {
  const { 
    user, 
    profile, 
    updateProfile, 
    registerUser, 
    loginUser, 
    eligibleSchemes,
    isDemoMode
  } = useApp();

  const navigate = useNavigate();

  // Auth form states
  const [isRegistering, setIsRegistering] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Form states (pre-populated with existing profile context)
  const [name, setName] = useState(profile?.name || "");
  const [age, setAge] = useState(profile?.age || 22);
  const [gender, setGender] = useState(profile?.gender || "Male");
  const [category, setCategory] = useState(profile?.category || "General");
  const [income, setIncome] = useState(profile?.income || 300000);
  const [state, setState] = useState(profile?.state || "Madhya Pradesh");
  const [occupation, setOccupation] = useState(profile?.occupation || "Student");
  const [disabilityStatus, setDisabilityStatus] = useState(profile?.disabilityStatus || false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const indianStates = [
    "All", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal"
  ];

  const occupations = [
    "Student", "Farmer", "Job Seeker", "Self Employed", "Business Owner", "Any"
  ];

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      if (isRegistering) {
        if (!authName) {
          setAuthError("Name is required");
          setAuthLoading(false);
          return;
        }
        await registerUser(authEmail, authPassword, authName);
      } else {
        await loginUser(authEmail, authPassword);
      }
    } catch (err) {
      setAuthError(err.message || "Authentication failed. Try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);

    try {
      await updateProfile({
        name,
        age: Number(age),
        gender,
        category,
        income: Number(income),
        state,
        occupation,
        disabilityStatus,
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  // Live matching check (triggered when user changes temporary fields in UI)
  const calculateLiveMatches = () => {
    // This replicates the context matching algorithm on local inputs before saving
    return eligibleSchemes.length; 
  };

  // Whenever the input changes, we write directly to context so calculations update reactively
  const handleFieldChange = (field, val) => {
    updateProfile({ [field]: val });
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-[#0b0f19] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {!user ? (
          /* Auth Portal Card */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl"
          >
            <div className="text-center mb-6">
              <div className="inline-flex h-12 w-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 items-center justify-center mb-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
                {isRegistering ? "Create your Account" : "Welcome Back"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {isDemoMode 
                  ? "Simulation mode is active. Log in with any email."
                  : "Sign in to sync your profile and bookmarks."}
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs flex items-center gap-2">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegistering && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-gradient-to-r from-brand-600 to-blue-600 hover:opacity-95 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition-all"
              >
                {authLoading ? "Authenticating..." : isRegistering ? "Create Profile" : "Sign In"}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                {isRegistering ? "Already have a profile? Sign In" : "New to SchemeAI? Create Profile"}
              </button>
            </div>
          </motion.div>
        ) : (
          /* Profile Parameters Form */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
            {/* Form Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
                    Eligibility Parameters
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Fill in your details accurately. The recommendation engine matches these attributes to scheme constraints.
                  </p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  {/* Name & Age */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <User className="h-3.5 w-3.5" /> Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          handleFieldChange("name", e.target.value);
                        }}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Age
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        max="120"
                        value={age}
                        onChange={(e) => {
                          setAge(e.target.value);
                          handleFieldChange("age", Number(e.target.value));
                        }}
                        className="w-full px-4 py-2.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 text-sm"
                      />
                    </div>
                  </div>

                  {/* Gender & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => {
                          setGender(e.target.value);
                          handleFieldChange("gender", e.target.value);
                        }}
                        className="w-full px-4 py-2.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 text-sm"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" /> Social Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          handleFieldChange("category", e.target.value);
                        }}
                        className="w-full px-4 py-2.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 text-sm"
                      >
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                      </select>
                    </div>
                  </div>

                  {/* State & Occupation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> Domicile State
                      </label>
                      <select
                        value={state}
                        onChange={(e) => {
                          setState(e.target.value);
                          handleFieldChange("state", e.target.value);
                        }}
                        className="w-full px-4 py-2.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 text-sm"
                      >
                        {indianStates.map((s, idx) => (
                          <option key={idx} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" /> Occupation
                      </label>
                      <select
                        value={occupation}
                        onChange={(e) => {
                          setOccupation(e.target.value);
                          handleFieldChange("occupation", e.target.value);
                        }}
                        className="w-full px-4 py-2.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 text-sm"
                      >
                        {occupations.map((o, idx) => (
                          <option key={idx} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Annual Income */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Landmark className="h-3.5 w-3.5" /> Annual Family Income (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="10000"
                      value={income}
                      onChange={(e) => {
                        setIncome(e.target.value);
                        handleFieldChange("income", Number(e.target.value));
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 text-sm"
                    />
                  </div>

                  {/* Disability Status */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <input
                      type="checkbox"
                      id="disabilityStatus"
                      checked={disabilityStatus}
                      onChange={(e) => {
                        setDisabilityStatus(e.target.checked);
                        handleFieldChange("disabilityStatus", e.target.checked);
                      }}
                      className="h-4.5 w-4.5 text-brand-600 focus:ring-brand-500 border-slate-300 rounded cursor-pointer"
                    />
                    <label htmlFor="disabilityStatus" className="text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer flex-1">
                      Person with Disability (Divyangjan status)
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <button
                      type="submit"
                      disabled={saveSuccess}
                      className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      {saveSuccess ? (
                        <>
                          <CheckCircle2 className="h-4.5 w-4.5" />
                          Profile Saved!
                        </>
                      ) : (
                        <>
                          Save & View Matches
                          <ChevronRight className="h-4.5 w-4.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Matching Preview Sidebar */}
            <div className="space-y-6">
              <div className="bg-gradient-to-tr from-brand-600 to-indigo-600 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                {/* Decorative mesh glow */}
                <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 blur-[30px] rounded-full" />
                
                <h3 className="font-heading font-extrabold text-xl mb-1">Live Matcher</h3>
                <p className="text-xs text-brand-100/80 mb-6">Eligible programs update instantly as you complete your profile details.</p>

                <div className="text-center py-6">
                  <div className="text-6xl font-heading font-extrabold tracking-tight mb-2">
                    {calculateLiveMatches()}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-brand-100">
                    Matching Schemes Found
                  </div>
                </div>

                <div className="border-t border-white/20 pt-4 mt-4 space-y-3">
                  <div className="text-xs font-medium text-brand-100 flex items-center justify-between">
                    <span>Target state constraints:</span>
                    <span className="font-semibold text-white">{state}</span>
                  </div>
                  <div className="text-xs font-medium text-brand-100 flex items-center justify-between">
                    <span>Occupation category:</span>
                    <span className="font-semibold text-white">{occupation}</span>
                  </div>
                  <div className="text-xs font-medium text-brand-100 flex items-center justify-between">
                    <span>Annual Income limit:</span>
                    <span className="font-semibold text-white">₹{Number(income).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Demo Mode Notice */}
              <div className="bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-slate-600 dark:text-slate-300 text-xs leading-relaxed space-y-2">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">🔒 Privacy Safeguard</h4>
                <p>
                  Your profile attributes are used exclusively for locally matching and summarizing program eligibility. We do not store or transmit this details to unverified third parties.
                </p>
                {isDemoMode && (
                  <p className="text-amber-600 dark:text-amber-400 font-medium">
                    ⚠️ Demo mode is active. Session data is stored in your local browser sandbox.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
