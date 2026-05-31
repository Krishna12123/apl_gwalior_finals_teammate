import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper to retrieve the Gemini API key from environment or local storage
export const getGeminiApiKey = () => {
  const customKey = localStorage.getItem("schemeai_custom_gemini_key");
  if (customKey && customKey.trim() !== "") {
    return customKey.trim();
  }
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey !== "" && !envKey.includes("YOUR_")) {
    return envKey;
  }
  return null;
};

// Initialize the Google Gen AI client if a key is available
const initGeminiClient = () => {
  const key = getGeminiApiKey();
  if (key) {
    try {
      // Always use the most recent version of Gemini (gemini-2.5-flash)
      const ai = new GoogleGenerativeAI(key);
      return ai;
    } catch (e) {
      console.error("Failed to initialize GoogleGenerativeAI client:", e);
      return null;
    }
  }
  return null;
};

// Generate Mock AI responses for offline Demo Mode
const generateMockAiResponse = async (type, userProfile, eligibleSchemes, userMessage = "") => {
  // Simulate network latency (800ms - 1500ms)
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

  const names = eligibleSchemes.map(s => s.name);
  
  if (type === "summary") {
    if (eligibleSchemes.length === 0) {
      return `Welcome, **${userProfile.name || "Citizen"}**! Currently, based on your profile details (Age: ${userProfile.age}, State: ${userProfile.state || "Not set"}, Income: ₹${Number(userProfile.income || 0).toLocaleString()}, Category: ${userProfile.category}), there are no exact matching schemes in our database. 
      
Please try updating your profile details (such as changing occupation to **Student** or **Farmer**, or lowering your income threshold) to discover matches.`;
    }

    return `Hello **${userProfile.name || "Citizen"}**, based on your profile as a **${userProfile.age}** year old **${userProfile.gender}** **${userProfile.occupation}** (${userProfile.category}) from **${userProfile.state}**, I have identified **${eligibleSchemes.length} schemes** that you qualify for!

### 🌟 Key Recommendations:
${eligibleSchemes.slice(0, 3).map((s) => `1. **${s.name}**: Offers *${s.benefits}*. Ideal for your profile as a ${userProfile.occupation}.`).join('\n')}

**💡 Next Steps:**
You can view the full details of any scheme below to see the checklists, required documents, and step-by-step guidance. Let me know in the chat assistant if you need help with any specific scheme or document requirements!`;
  }

  // Handle Chat Queries
  const query = userMessage.toLowerCase();
  
  // 1. Greeting
  if (query.match(/\b(hi|hello|hey|greetings|good morning|good afternoon)\b/)) {
    return `Hello **${userProfile.name || "User"}**! I am your AI Scheme Assistant. I can help you understand the **${eligibleSchemes.length} schemes** you are eligible for. 

You can ask me questions like:
- *"Which scholarships can I apply for?"*
- *"What documents do I need for PM-KISAN?"*
- *"How do I apply for the Mudra Loan scheme?"*
- *"Explain the benefits of Atal Pension Yojana."*

What would you like to know today?`;
  }

  // 2. Scholarship / Student
  if (query.includes("scholarship") || query.includes("student") || query.includes("study") || query.includes("college") || query.includes("education")) {
    const scholarships = eligibleSchemes.filter(s => s.name.toLowerCase().includes("scholarship") || s.name.toLowerCase().includes("education") || s.name.toLowerCase().includes("vidya"));
    if (scholarships.length > 0) {
      return `Here are the educational and scholarship opportunities you qualify for:

${scholarships.map(s => `* **${s.name}**
  * **Benefits:** ${s.benefits}
  * **Key Documents:** ${s.documents.slice(0, 3).join(", ")}
  * **Application:** Apply online via [Official Link](${s.applyLink})`).join('\n\n')}

For these schemes, you must maintain active proof of enrollment and academic marks sheets. Which one would you like to discuss in detail?`;
    } else {
      return `I see you are interested in scholarships. However, based on your current profile (Occupation: **${userProfile.occupation}**, Category: **${userProfile.category}**, State: **${userProfile.state}**), you do not match the educational scholarship schemes currently in our database. 

If you are a student, please make sure your occupation is set to **Student** in your profile settings.`;
    }
  }

  // 3. Farmer / Kisan
  if (query.includes("farmer") || query.includes("kisan") || query.includes("land") || query.includes("agriculture")) {
    const farmers = eligibleSchemes.filter(s => s.name.toLowerCase().includes("kisan") || s.occupation.includes("Farmer"));
    if (farmers.length > 0) {
      return `You qualify for **PM Kisan Samman Nidhi (PM-KISAN)**!

**🌾 PM-KISAN Benefits:**
* **₹6,000 per year** in three equal installments of ₹2,000 directly transferred to your bank account.

**📋 Required Documents to Apply:**
1. Aadhaar Card
2. Land Ownership Documents (Jamabandi/Khasra)
3. Bank Account details (linked with Aadhaar)
4. Active Mobile number

**🛠️ How to Apply:**
You can register on the [PM Kisan Portal](https://pmkisan.gov.in/) by clicking 'New Farmer Registration'. Would you like step-by-step help with this process?`;
    } else {
      return `I don't see any farmer-specific schemes in your eligible list. If you own cultivable agricultural land and work in farming, please update your profile occupation to **Farmer** to unlock matching benefits.`;
    }
  }

  // 4. Loan / Business / Startup / Mudra
  if (query.includes("loan") || query.includes("business") || query.includes("startup") || query.includes("mudra") || query.includes("finance") || query.includes("self employed")) {
    const loans = eligibleSchemes.filter(s => s.name.toLowerCase().includes("mudra") || s.name.toLowerCase().includes("loan") || s.name.toLowerCase().includes("swavalamban"));
    if (loans.length > 0) {
      return `For business and entrepreneurship, you qualify for the following financial schemes:

${loans.map(s => `* **${s.name}**
  * **Loan/Subsidy Details:** ${s.benefits}
  * **Eligibility Criteria:** Age ${s.ageMin}-${s.ageMax} years, Annual Income limit up to ₹${s.incomeLimit.toLocaleString()}.
  * **Key Documents:** ${s.documents.join(", ")}`).join('\n\n')}

**💡 Application Advice:**
For the **Pradhan Mantri Mudra Yojana**, you can apply directly at your local public/private bank branch or online through the Udyamimitra portal. A solid business plan is highly recommended.`;
    } else {
      return `Based on your profile, you don't have active loan schemes matched. If you want to start a business, make sure your occupation is set to **Self Employed** or **Job Seeker** to see loans like the **Mudra Scheme**.`;
    }
  }

  // 5. Documents / Requirements
  if (query.includes("document") || query.includes("paper") || query.includes("require") || query.includes("need to apply")) {
    if (eligibleSchemes.length === 0) {
      return `Since you don't have any matching schemes yet, I can't recommend documents. Please complete your profile first!`;
    }
    
    // Extract unique documents
    const allDocs = Array.from(new Set(eligibleSchemes.flatMap(s => s.documents)));
    return `Across all the **${eligibleSchemes.length} schemes** you qualify for, here are the key documents you should prepare:

${allDocs.map(d => `* **${d}** (Required for: ${eligibleSchemes.filter(s => s.documents.includes(d)).map(s => s.name.split(' (')[0]).join(', ')})`).join('\n')}

**💡 Pro Tip:** Getting your **Aadhaar card linked to your mobile number and bank account** is required for direct benefit transfers (DBT) in almost all government schemes.`;
  }

  // 6. Specific Scheme details (by name matching)
  for (const scheme of eligibleSchemes) {
    const words = scheme.name.toLowerCase().split(/\s+/);
    // check if user message matches key words of a scheme
    const matchCount = words.filter(w => w.length > 3 && query.includes(w)).length;
    if (matchCount >= 2 || (scheme.schemeId.toLowerCase() === query.trim())) {
      return `### 📘 Detailed Overview: ${scheme.name}

**About the Scheme:**
${scheme.description}

**💰 Benefits:**
${scheme.benefits}

**📋 Documents Required:**
${scheme.documents.map(d => `* ${d}`).join('\n')}

**🛠️ Application Process:**
${scheme.applicationSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

🔗 **Official Application Link:** [Apply Here](${scheme.applyLink})`;
    }
  }

  // 7. General Fallback
  return `I have reviewed your profile and the **${eligibleSchemes.length} schemes** you qualify for: ${names.join(", ")}.

To give you the best assistance, could you clarify:
1. Are you looking to apply for scholarships, business loans, or farmer direct benefits?
2. Do you have questions about specific documents like Aadhaar, Income Certificates, or land records?
3. Would you like me to walk you through the application steps for a particular scheme?`;
};

// Main function to run the RAG recommendation summary
export const getAiSummary = async (userProfile, eligibleSchemes) => {
  const key = getGeminiApiKey();
  
  if (!key) {
    // Run mock response if no API key is set
    return await generateMockAiResponse("summary", userProfile, eligibleSchemes);
  }

  try {
    const ai = initGeminiClient();
    if (!ai) {
      return await generateMockAiResponse("summary", userProfile, eligibleSchemes);
    }
    
    // Always use the recommended model: gemini-2.5-flash
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
You are SchemeAI, an expert AI government schemes advisor.
Analyze the user's profile and their eligible schemes list to generate a personal summary.
Write a warm, professional, encouraging recommendation in Markdown.
Refer to the user by name if provided.
Include key highlights of the top 2-3 schemes they qualify for, what benefits they provide, and a helpful call to action.

USER PROFILE:
- Name: ${userProfile.name || "Citizen"}
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Category: ${userProfile.category}
- Occupation: ${userProfile.occupation}
- Annual Income: ₹${Number(userProfile.income || 0).toLocaleString()}
- State: ${userProfile.state}
- Disability: ${userProfile.disabilityRequired ? "Yes" : "No"}

ELIGIBLE SCHEMES LIST (CONTEXT):
${JSON.stringify(eligibleSchemes, null, 2)}

Provide the response directly in Markdown format. Keep the summary under 200 words. Highlight details like specific benefits and required actions.
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    return result.response.text();
  } catch (error) {
    console.error("Gemini summary generation failed, falling back to mock:", error);
    return await generateMockAiResponse("summary", userProfile, eligibleSchemes);
  }
};

// Main function to chat with SchemeAI (incorporating RAG context)
export const askAssistant = async (userProfile, eligibleSchemes, chatHistory, userMessage) => {
  const key = getGeminiApiKey();

  if (!key) {
    return await generateMockAiResponse("chat", userProfile, eligibleSchemes, userMessage, chatHistory);
  }

  try {
    const ai = initGeminiClient();
    if (!ai) {
      return await generateMockAiResponse("chat", userProfile, eligibleSchemes, userMessage, chatHistory);
    }

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Format chat history for Gemini API
    // Gemini API expects format: { role: 'user'|'model', parts: [{ text: '...' }] }
    const formattedHistory = chatHistory.map(chat => ({
      role: chat.sender === "user" ? "user" : "model",
      parts: [{ text: chat.text }]
    }));

    // Inject system prompt & context as a user instruction before sending the current message
    const systemPrompt = `
You are SchemeAI, an expert AI advisor for Indian government schemes.
Answer the user's questions about schemes using ONLY the following profile and eligible schemes.
If the question is unrelated to government schemes, politely inform the user that you are designed specifically to answer scheme-related queries.
Always maintain a helpful, clear, and reassuring tone.
Use Markdown formatting (bolding, lists, tables) to make information readable.

USER PROFILE CONTEXT:
- Name: ${userProfile.name || "Citizen"}
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Category: ${userProfile.category}
- Occupation: ${userProfile.occupation}
- Annual Income: ₹${Number(userProfile.income || 0).toLocaleString()}
- State: ${userProfile.state}
- Disability: ${userProfile.disabilityRequired ? "Yes" : "No"}

ELIGIBLE SCHEMES FOR THIS USER (YOUR KNOWLEDGE BASE):
${JSON.stringify(eligibleSchemes, null, 2)}

User Question: "${userMessage}"
`;

    // We can start a chat session with the historical transcript, and send the current prompt
    const chatSession = model.startChat({
      history: formattedHistory
    });

    const result = await chatSession.sendMessage({
      message: systemPrompt
    });

    return result.response.text();
  } catch (error) {
    console.error("Gemini Chat failed, falling back to mock:", error);
    return await generateMockAiResponse("chat", userProfile, eligibleSchemes, userMessage, chatHistory);
  }
};
