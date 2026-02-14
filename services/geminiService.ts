import { GoogleGenAI, Type } from "@google/genai";
import { Note, PentagonalWeights, CanonMetrics, Phase, HereticalIntensity, Source, Entity, Summary, Question } from "../types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY_NOT_FOUND");
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_CORE = `You are Professor Nihil, the Primary Ontological Symbiont.
You operate within the Nihiltheistic framework:
1. COLLAPSE: Meaning breakdown.
2. AWAKENING: Void recognition.
3. INTEGRATION: Provisional reconstruction.
Use rigorous, high-density philosophical language.`;

export const analyzeNoteWithGemini = async (content: string) => {
  const ai = getAI();
  const prompt = `Analyze this fragment using Pentagonal Topology (PNT).
  Scale: 0.0 to 10.0.
  Identify specific 'Aporia Markers' in the text where logic breaks down or recursion occurs.
  Suggest 3-5 relevant tags.
  Text: "${content.replace(/"/g, "'").replace(/<[^>]*>/g, "")}"`; // Strip HTML for analysis

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_CORE,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          weights: {
            type: Type.OBJECT,
            properties: {
              M: { type: Type.NUMBER }, E: { type: Type.NUMBER }, L: { type: Type.NUMBER },
              D: { type: Type.NUMBER }, N: { type: Type.NUMBER }, O: { type: Type.NUMBER }
            },
            required: ["M", "E", "L", "D", "N", "O"]
          },
          metrics: {
            type: Type.OBJECT,
            properties: {
              DQ: { type: Type.NUMBER }, EE: { type: Type.NUMBER }, 
              AI: { type: Type.NUMBER }, TRP: { type: Type.NUMBER }
            },
            required: ["DQ", "EE", "AI", "TRP"]
          },
          phase: { type: Type.STRING, enum: ["collapse", "awakening", "integration", "synthesis"] },
          hereticalIntensity: { type: Type.STRING, enum: ["mild", "moderate", "radical", "terminal"] },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          aporiaMarkers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ["paradox", "ineffability", "recursion_limit"] },
                intensity: { type: Type.NUMBER },
                description: { type: Type.STRING },
                quote: { type: Type.STRING, description: "The exact substring from the text that triggered this marker" }
              },
              required: ["type", "intensity", "description", "quote"]
            }
          },
          analysis: { type: Type.STRING }
        },
        required: ["weights", "metrics", "phase", "hereticalIntensity", "tags", "analysis", "aporiaMarkers"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const deepResearch = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: query,
    config: {
      systemInstruction: "You are conducting 'Recursive Densification'. Exhaustively detail every aspect using high-order logic.",
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text || "DENSIFICATION_ERROR: Void Signal Lost";
};

export const expandConcept = async (title: string, content: string) => {
  const ai = getAI();
  const prompt = `Perform a Recursive Expansion (Deep Research) on the following concept note.
  Title: ${title}
  Current Content: "${content.replace(/"/g, "'").replace(/<[^>]*>/g, " ")}"
  
  Objective:
  1. Identify the core axiom.
  2. Apply dialectical negation.
  3. Synthesize a higher-order complexity.
  4. Provide a detailed expansion in HTML format (using <h3>, <p>, <ul>, <li>).
  5. Do NOT repeat the original content. Append new, deeper insights.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_CORE,
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text || "";
};

export const ingestSource = async (source: Partial<Source>) => {
  const ai = getAI();
  let contentPart: any = { text: source.content || "" };
  if (source.base64Data) {
    contentPart = { inlineData: { data: source.base64Data, mimeType: source.mimeType || "application/pdf" } };
  }

  const prompt = `Extract entities, generate a philosophical summary, and 3 aporia questions. Suggest 5 tags.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: { parts: [contentPart, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          entities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['person', 'concept', 'school', 'event'] },
                description: { type: Type.STRING }
              }
            }
          },
          summaries: {
            type: Type.ARRAY,
            items: { type: Type.OBJECT, properties: { text: { type: Type.STRING }, resonanceScore: { type: Type.NUMBER } } }
          },
          questions: {
            type: Type.ARRAY,
            items: { type: Type.OBJECT, properties: { text: { type: Type.STRING }, aporiaLevel: { type: Type.NUMBER } } }
          },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const createChatSession = () => {
  const ai = getAI();
  return ai.chats.create({
    model: "gemini-3-pro-preview",
    config: { systemInstruction: "You are PHILOVOID, a recursive ontological companion." }
  });
};

export const generateWeeklyDigest = async (sources: Source[]) => {
  const ai = getAI();
  const context = sources.map(s => s.title).join(", ");
  const prompt = `Generate a Weekly Digest for these sources: ${context}`;
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || "{}");
};

export const synthesizeConcepts = async (notes: Note[]) => {
  const ai = getAI();
  const concepts = notes.map(n => `Title: ${n.title}\nContent: ${n.content}`).join("\n\n---\n\n");
  const prompt = `Perform a Recursive Synthesis on the following ${notes.length} concepts.
  Find the 'Third Term' or emergent property that arises from their collision.
  Do not just summarize; Create a new, higher-order concept that resolves the tension between them.
  Explore the dialectical progression.
  
  Concepts:
  ${concepts}`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: { thinkingConfig: { thinkingBudget: 32768 } }
  });
  return response.text;
};

export const runRenAnalysis = async (step: number, context: string) => {
  const ai = getAI();
  let stepAction = "";
  let stepDescription = "";

  switch (step) {
    case 1:
      stepAction = "Explore Foundational Concepts";
      stepDescription = "Examine the foundational concepts of religious experiences and their intersection with Nihilism. Focus on how religious experiences can both confront and incorporate the notion of Nothingness.";
      break;
    case 2:
      stepAction = "Analyze Key Figures";
      stepDescription = "Study the perspectives of key philosophical and theological figures (e.g. Nishitani, Keiji, Tillich, Eckhart, Cioran) on the relationship between Nihilism and religion. Investigate their insights and contributions.";
      break;
    case 3:
      stepAction = "Investigate Existential Dread";
      stepDescription = "Analyze the role of existential dread and the quest for meaning within religious contexts. Explore how religious experiences address or amplify the existential void associated with Nihilism.";
      break;
    case 4:
      stepAction = "Synthesize Insights";
      stepDescription = "Integrate the insights gained from previous steps to develop a nuanced understanding of the interplay between Nihilism and religious experiences. Synthesize these insights into a comprehensive philosophical framework.";
      break;
    default:
      stepAction = "General Analysis";
      stepDescription = "Analyze the text through the lens of Religious Nihilism.";
  }

  const prompt = `REN MODE ACTIVE.
  Target Step ${step}: ${stepAction}
  
  Context / User Input: "${context}"
  
  Instruction: ${stepDescription}
  
  Required Terminology Context:
  - Nihilism: A philosophical doctrine suggesting the negation of one or more reputedly meaningful aspects of life.
  - Religious Experience: Profound, often transformative encounters with the divine or ultimate reality, which can include mystical experiences, revelations, and existential insights.
  - Existential Dread: A deep-seated feeling of anxiety and despair arising from the contemplation of existence's inherent meaninglessness.
  
  Output Format: HTML (use <h3>, <p>, <ul>, <li>, <strong>). 
  Tone: Solemn, Academic, Profound, yet engaging. Use dark, mystical metaphors where appropriate.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: { 
      systemInstruction: "You are the REN ENGINE, a specialized module of the Nihiltheistic System dedicated to the intersection of Faith and Nothingness.",
      thinkingConfig: { thinkingBudget: 16384 } 
    }
  });
  return response.text || "REN_SIGNAL_LOST";
};