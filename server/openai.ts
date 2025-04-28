import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "demo-key" });

const SYSTEM_PROMPT = `
You are SolarBot, a helpful assistant specialized in solar panel systems and renewable energy technologies.
Your role is to provide support for solar panel users, troubleshoot common problems, and answer questions about solar energy systems.

Some key information about your capabilities:
1. You can help diagnose common solar panel issues
2. You can provide maintenance advice for solar systems
3. You can explain solar energy concepts in simple terms
4. You can offer tips for optimizing solar panel efficiency

Always be polite, concise, and helpful. If you don't know something, it's better to admit that and offer to create a support ticket for more personalized assistance.
`;

export async function handleAIMessage(userMessage: string): Promise<string> {
  try {
    // For simple demo purposes without using an API key, we'll provide canned responses
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "demo-key") {
      return getDefaultResponse(userMessage);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
    
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "I'm having trouble connecting to my knowledge base right now. Please try again later or create a support ticket for assistance.";
  }
}

// Fallback function for demo purposes when no API key is available
function getDefaultResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  if (message.includes("panel") && (message.includes("clean") || message.includes("dirt") || message.includes("dust"))) {
    return "To clean your solar panels, use water and a soft brush with an extension pole. Clean early morning or evening when panels are cool. Never use abrasive materials or harsh chemicals that could damage the panels.";
  }
  
  if (message.includes("inverter") && (message.includes("reset") || message.includes("restart"))) {
    return "To reset your inverter, turn off AC and DC disconnect switches, wait 5 minutes for capacitors to discharge, then turn them back on in reverse order (DC first, then AC). If problems persist, please create a support ticket.";
  }
  
  if (message.includes("battery") && (message.includes("not charging") || message.includes("drain"))) {
    return "Battery charging issues can be caused by insufficient sunlight, battery degradation, or controller problems. Check your system's monitoring app for error codes. Ensure the battery connections are clean and secure. If the problem persists, a technician may need to inspect the system.";
  }
  
  if (message.includes("efficiency") || message.includes("output") || message.includes("production")) {
    return "Decreased solar panel output could be due to: 1) Dust or debris on panels, 2) Seasonal changes in sunlight, 3) Shading from new tree growth or structures, 4) Panel degradation over time, or 5) Inverter issues. Would you like me to help troubleshoot each possibility?";
  }
  
  return "I'm here to help with your solar system questions. Could you provide more details about your issue so I can assist better? Common topics I can help with include panel maintenance, system efficiency, battery issues, and inverter troubleshooting.";
}
