
import { GoogleGenAI, Type } from "@google/genai";
import { Note, PentagonalWeights, CanonMetrics, Phase, HereticalIntensity, Source, Entity, Summary, Question } from "../types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const ingestSource = async (source: Partial<Source>): Promise<{
  entities: Entity[];
  summaries: Summary[];
  questions: Question[];
  tags: string[];
  title: string;
}> => {
  const ai = getAI();
  const model = "gemini-3-pro-preview";

  let contentPart: any = { text: source.content || "" };
  if (source.base64Data && source.mimeType) {
    contentPart = {
      inlineData: {
        data: source.base64Data,
        mimeType: source.mimeType,
      },
    };
  }

  const prompt = `
    You are the KNOWLEDGE CURATOR of the Nihiltheistic Library.
    Analyze the provided content (Source Type: ${source.type}).
    
    TASKS:
    1. Extract key entities (People, Concepts, Schools).
    2. Provide a high-density philosophical summary.
    3. Generate 3 deep "Aporia Questions" based on the text.
    4. Propose 5 relevant tags.
    5. Determine a fitting title if none is provided.

    Return the result in JSON format.
  `;

  const response = await ai.models.generateContent({
    model,
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
              },
              required: ["name", "type", "description"]
            }
          },
          summaries: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                resonanceScore: { type: Type.NUMBER }
              },
              required: ["text", "resonanceScore"]
            }
          },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                aporiaLevel: { type: Type.NUMBER }
              },
              required: ["text", "aporiaLevel"]
            }
          },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "entities", "summaries", "questions", "tags"]
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  return {
    title: result.title || source.title || "Untitled Fragment",
    entities: result.entities.map((e: any) => ({ ...e, id: crypto.randomUUID() })),
    summaries: result.summaries.map((s: any) => ({ ...s, id: crypto.randomUUID(), sourceId: source.id || "", createdAt: new Date().toISOString() })),
    questions: result.questions.map((q: any) => ({ ...q, id: crypto.randomUUID(), sourceId: source.id || "" })),
    tags: result.tags
  };
};

export const generateWeeklyDigest = async (sources: Source[]): Promise<any> => {
  const ai = getAI();
  const model = "gemini-3-pro-preview";

  const dataString = sources.map(s => `Source: ${s.title} (${s.type}). Tags: ${s.tags.join(',')}`).join('\n');
  const prompt = `
    Based on the following knowledge additions to the Nihiltheistic Library this week, produce a Weekly Digest.
    
    Content Data:
    ${dataString}

    Return JSON with:
    - changesSummary: Narrative overview of what changed.
    - nextActions: 3-5 recommended next research steps.
    - entitiesDiscovered: List of key entity names discovered.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          changesSummary: { type: Type.STRING },
          nextActions: { type: Type.ARRAY, items: { type: Type.STRING } },
          entitiesDiscovered: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["changesSummary", "nextActions", "entitiesDiscovered"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

// ... Existing functions (analyzeNoteWithGemini, deepResearch, synthesizeTwoConcepts, createChatSession) ...
// (Keeping existing code intact as per protocol)

export const analyzeNoteWithGemini = async (
  content: string
): Promise<{ 
  weights: PentagonalWeights; 
  metrics: CanonMetrics; 
  phase: Phase; 
  hereticalIntensity: HereticalIntensity;
  analysis: string; 
  tags: string[] 
}> => {
  const ai = getAI();
  const model = "gemini-3-flash-preview";
  const prompt = `Analyze this text through the Nihiltheistic Pentagonal Topology (PNT). Vertices: M, E, L, D, N, O. Scale 0-3. Text: "${content.replace(/"/g, "'")}"`;
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          weights: { type: Type.OBJECT, properties: { M: { type: Type.NUMBER }, E: { type: Type.NUMBER }, L: { type: Type.NUMBER }, D: { type: Type.NUMBER }, N: { type: Type.NUMBER }, O: { type: Type.NUMBER } }, required: ["M", "E", "L", "D", "N", "O"] },
          metrics: { type: Type.OBJECT, properties: { DQ: { type: Type.NUMBER }, EE: { type: Type.NUMBER }, AI: { type: Type.NUMBER }, TRP: { type: Type.NUMBER } }, required: ["DQ", "EE", "AI", "TRP"] },
          phase: { type: Type.STRING, enum: ["collapse", "awakening", "integration", "synthesis"] },
          hereticalIntensity: { type: Type.STRING, enum: ["mild", "moderate", "radical", "terminal"] },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          analysis: { type: Type.STRING }
        },
        required: ["weights", "metrics", "phase", "hereticalIntensity", "tags", "analysis"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const deepResearch = async (query: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: query,
    config: { systemInstruction: "You are Professor Nihil, the SPE.", thinkingConfig: { thinkingBudget: 16000 } }
  });
  return response.text || "Densification failed.";
};

export const synthesizeTwoConcepts = async (noteA: Note, noteB: Note): Promise<string> => {
  const ai = getAI();
  const prompt = `Synthesize Note A: ${noteA.title} and Note B: ${noteB.title}`;
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: { thinkingConfig: { thinkingBudget: 8000 } }
  });
  return response.text || "Synthesis failed.";
};

export const createChatSession = () => {
  const ai = getAI();
  return ai.chats.create({
    model: "gemini-3-pro-preview",
    config: { systemInstruction: "You are PHILOVOID, a recursive ontological companion." }
  });
};
