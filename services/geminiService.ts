import { GoogleGenAI, Type } from "@google/genai";
import { Note, PentagonalWeights, CanonMetrics, Phase, HereticalIntensity, Source, Entity, Summary, Question } from "../types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY_NOT_FOUND");
  return new GoogleGenAI({ apiKey });
};

export const uploadFileToGemini = async (file: File) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY_NOT_FOUND");
  
  // 1. Start resumable upload
  const startRes = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'X-Goog-Upload-Protocol': 'resumable',
      'X-Goog-Upload-Command': 'start',
      'X-Goog-Upload-Header-Content-Length': file.size.toString(),
      'X-Goog-Upload-Header-Content-Type': file.type,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ file: { display_name: file.name } })
  });
  
  if (!startRes.ok) {
    throw new Error(`Failed to start upload: ${await startRes.text()}`);
  }
  
  const uploadUrl = startRes.headers.get('X-Goog-Upload-URL');
  if (!uploadUrl) throw new Error("No upload URL returned");

  // 2. Upload the file
  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Content-Length': file.size.toString(),
      'X-Goog-Upload-Offset': '0',
      'X-Goog-Upload-Command': 'upload, finalize',
    },
    body: file
  });
  
  if (!uploadRes.ok) {
    throw new Error(`Failed to upload file: ${await uploadRes.text()}`);
  }
  
  const fileInfo = await uploadRes.json();
  return fileInfo.file; // { uri: string, mimeType: string, name: string }
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

export const ingestSourceToWiki = async (content: string, filename: string) => {
  const ai = getAI();
  const prompt = `You are a strict LLM Wiki maintainer.
Read the following source document and generate a new Wiki Page entry that represents the core concepts, summary, and entities found in this source.

Source filename: ${filename}
Source content:
"""
${content.substring(0, 50000)} // truncate to avoid giant files breaking limits
"""

Provide the output as a JSON object with:
- "title": A short semantic title for the wiki page (e.g., "Concept: Quantum Coherence")
- "category": Must be one of: "concept", "entity", "summary", "analysis"
- "markdown": The actual markdown content of the wiki page, containing an abstract, key concepts, entity relationships, and synthesis.
- "tags": Array of 3-5 string tags.
`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          category: { type: Type.STRING, enum: ["concept", "entity", "summary", "analysis"] },
          markdown: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "category", "markdown", "tags"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const ingestSource = async (source: Partial<Source>, file?: File) => {
  let contentText = source.content || source.title || "";
  
  if (file) {
    // For file support using Python Engine, we may need OCR or text extraction, 
    // but for now we forward the filename and any extracted local text.
    // In a fully deployed system, the Node.js API Gateway would extract text here.
    contentText = `[FILE INGESTION REQUEST: ${file.name}] ${contentText}`;
  }

  // Forward to Python Cognitive Engine
  const response = await fetch('/api/v1/cognitive/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      raw_text: contentText,
      context: `Source Type: ${source.type}`
    })
  });

  if (!response.ok) {
    throw new Error('Python Cognitive Engine failed to process the request.');
  }

  const result = await response.json();
  
  // Map Python GraphExtractionResult back to Source structure
  return {
    title: source.title || "Ingested Node",
    entities: result.nodes.map((n: any) => ({
      name: n.label,
      type: n.cat,
      description: n.desc
    })),
    summaries: [{ text: result.system_insight, resonanceScore: 0.8 }],
    questions: [],
    tags: result.nodes.map((n: any) => n.cat)
  };
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