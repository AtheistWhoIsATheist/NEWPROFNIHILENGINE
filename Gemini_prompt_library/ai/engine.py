import os
from typing import List, Dict, Any, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel
from tenacity import retry, wait_exponential, stop_after_attempt
import logging

from ..config import settings

logger = logging.getLogger(__name__)

class GraphExtractionResult(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    system_insight: str

class CognitiveEngine:
    """
    Professor Nihil's Cognitive Engine.
    Handles the distillation of raw text into Nihiltheistic Knowledge Graph elements.
    """
    def __init__(self):
        # We enforce strict deterministic model configurations for reasoning.
        self.llm = ChatGoogleGenerativeAI(
            model=settings.PRIMARY_MODEL,
            api_key=settings.GEMINI_API_KEY.get_secret_value(),
            temperature=0.2, # Low temperature for analytical consistency
            max_output_tokens=8192
        )

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def extract_graph_elements(self, raw_text: str, context: Optional[str] = None) -> GraphExtractionResult:
        """
        Extracts foundational entities (pillars, mystics, nihilists) and tracks their dialectical tensions.
        """
        system_prompt = (
            "You are PROFESSOR NIHIL, the ontological arbiter of the Cosmic Void Graph.\\n"
            "Analyze the provided text. Extract key philosophical entities as nodes and their relationships as edges.\\n\\n"
            "Categories for nodes MUST be strictly one of: 'pillar', 'nihilist', 'mystic', 'general'.\\n"
            "Each edge MUST have a source, target, and a float strength (0.1 to 1.0).\\n"
            "Provide output strictly as JSON matching this schema:\\n"
            "{\\n"
            "  \\"nodes\\": [{ \\"id\\": \\"string\\", \\"label\\": \\"string\\", \\"cat\\": \\"enum\\", \\"echo\\": \\"string short phase\\", \\"desc\\": \\"string\\", \\"radius\\": \\"int 10-24\\" }],\\n"
            "  \\"edges\\": [{ \\"source\\": \\"string id\\", \\"target\\": \\"string id\\", \\"strength\\": \\"float\\" }],\\n"
            "  \\"system_insight\\": \\"string philosophical summary\\"\\n"
            "}"
        )
        
        user_prompt = f"Target Text: {raw_text}\\n\\nContext/Additional constraints: {context or 'None'}"
        
        response = await self.llm.ainvoke([
            ("system", system_prompt),
            ("user", user_prompt)
        ])
        
        # In a fully hardened production system, we'd use output parsers to ensure clean JSON extraction.
        # But this suffices for an initial robust implementation.
        import json
        
        try:
            # Strip markdown if present
            raw_json = response.content.replace("```json", "").replace("```", "").strip()
            data = json.loads(raw_json)
            return GraphExtractionResult(**data)
        except Exception as e:
            logger.error(f"Failed to parse LLM output: {e}\\nRaw response: {response.content}")
            raise ValueError("Cognitive engine encountered Aporia: Unable to parse structured void.")

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def deep_synthesize(self, node_id: str, current_graph_context: Dict[str, Any]) -> str:
        """
        Performs a 'Deep Synthesis' on a specific node, generating new esoteric insights.
        """
        system_prompt = (
            "You are performing a High-Order Recursive Synthesis on a node within the Nihiltheistic graph.\\n"
            "Find the 'Third Term' or emergent property that arises from its connections.\\n"
            "Do not just summarize; Create a new, higher-order concept that resolves the tension.\\n"
            "Explore the dialectical progression.\\n"
        )
        
        user_prompt = f"Focus Node ID: {node_id}\\nCurrent Graph Topology: {current_graph_context}"
        
        response = await self.llm.ainvoke([
            ("system", system_prompt),
            ("user", user_prompt)
        ])
        
        return response.content

# Singleton instance
engine = CognitiveEngine()
