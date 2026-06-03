import Groq from "groq-sdk";

const mock = (task, patient, extra = {}) => {
  const disclaimer = "\n\nAI assistance only. Please consult a qualified doctor.";
  if (task === "summary") {
    if (!patient.diseases?.length && !patient.medications?.length) {
      return "Not enough information available." + disclaimer;
    }
    return `Patient ${patient.name} is ${patient.age || "N/A"} years old with history of ${patient.diseases?.join(", ") || "no major chronic disease"}. Allergies: ${patient.allergies?.join(", ") || "none recorded"}. Current medicines: ${patient.medications?.join(", ") || "none recorded"}. Review uploaded reports and timeline before prescribing.` + disclaimer;
  }
  if (task === "triage") {
    const sym = (extra.symptoms || "").toLowerCase();
    const isChest = sym.includes("chest") || sym.includes("heart") || sym.includes("breath");
    return {
      riskLevel: isChest ? "High" : "Medium",
      specialist: isChest ? "Cardiologist" : "General Physician",
      advice: "Seek immediate professional medical help. This response is for general guidance only." + disclaimer,
      reasoning: "Risk evaluated using symptoms and patient medical history."
    };
  }
  if (task === "copilot") {
    const q = (extra.question || "").toLowerCase();
    // Check if we have records relevant to the question
    const patientText = JSON.stringify(patient).toLowerCase();
    const keywords = q.split(" ").filter(w => w.length > 3);
    const hasMatch = keywords.some(k => patientText.includes(k));
    
    if (!hasMatch) {
      return "Not enough information available." + disclaimer;
    }
    return `Based on stored records, ${patient.name}'s history includes ${patient.diseases?.join(", ") || "no major chronic diseases"}, allergies ${patient.allergies?.join(", ") || "none"}, and timeline entries: ${patient.visits?.map(v => `${v.date}: ${v.title}`).join("; ")}.` + disclaimer;
  }
  return "AI response unavailable." + disclaimer;
};

export async function askGroq({ task, patient, prompt, extra }) {
  if (!process.env.GROQ_API_KEY) return mock(task, patient, extra);
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
  const system = `You are HealthVault AI, a secure clinical support assistant. You are not a doctor.
Do not provide a final diagnosis. Include the safety disclaimer at the end of your response: "AI assistance only. Please consult a qualified doctor."
If you do not have sufficient information in the stored records or context to answer the question, you must respond with: "Not enough information available."
Keep responses concise, professional, and doctor-friendly.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt }
    ],
    temperature: 0.2,
    max_tokens: 900
  });
  
  const text = completion.choices?.[0]?.message?.content || "No response generated.";
  
  if (task === "triage") {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      return JSON.parse(jsonStr);
    } catch (e) {
      return {
        riskLevel: "Review",
        specialist: "General Physician",
        advice: text,
        reasoning: "LLM returned unstructured output."
      };
    }
  }
  return text;
}
