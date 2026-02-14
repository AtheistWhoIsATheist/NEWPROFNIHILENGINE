export type Phase = 'collapse' | 'awakening' | 'integration' | 'synthesis';
export type HereticalIntensity = 'mild' | 'moderate' | 'radical' | 'terminal';
export type AporiaType = 'paradox' | 'ineffability' | 'recursion_limit';
export type SourceType = 'link' | 'pdf' | 'video' | 'text';

export interface PentagonalWeights {
  M: number; E: number; L: number; D: number; N: number; O: number;
}

export interface CanonMetrics {
  DQ: number; // Despair Quotient
  EE: number; // Entropic Energy
  AI: number; // Axiomatic Integrity
  TRP: number; // Transcendental Resonance
}

export interface AporiaMarker {
  id: string;
  type: AporiaType;
  intensity: number;
  description: string;
  quote?: string; // Text fragment triggering the marker
}

export interface Note {
  id: string;
  title: string;
  content: string; // HTML content for rich text
  phase: Phase;
  hereticalIntensity: HereticalIntensity;
  recursiveDepth: number;
  weights: PentagonalWeights;
  metrics: CanonMetrics;
  tags: string[];
  aporiaMarkers: AporiaMarker[];
  createdAt: string;
  updatedAt: string;
  aiAnalysis?: string;
  isCanon: boolean;
}

export interface Entity {
  id: string;
  name: string;
  type: 'person' | 'concept' | 'school' | 'event';
  description: string;
}

export interface Summary {
  id: string;
  sourceId: string;
  text: string;
  resonanceScore: number;
  createdAt: string;
}

export interface Question {
  id: string;
  sourceId: string;
  text: string;
  aporiaLevel: number;
}

export interface Source {
  id: string;
  type: SourceType;
  title: string;
  url?: string;
  content?: string;
  base64Data?: string;
  mimeType?: string;
  status: 'pending' | 'indexed' | 'failed';
  entities: Entity[];
  summaries: Summary[];
  questions: Question[];
  tags: string[];
  createdAt: string;
}

export interface WeeklyDigest {
  id: string;
  startDate: string;
  endDate: string;
  changesSummary: string;
  nextActions: string[];
  entitiesDiscovered: string[];
}

export interface ResearchQuery {
  id: string;
  prompt: string;
  response: string;
  thoughts?: string[];
  model: string;
  timestamp: string;
  resonanceBoost: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  thoughts?: string;
  timestamp: string;
  isStreaming?: boolean;
}