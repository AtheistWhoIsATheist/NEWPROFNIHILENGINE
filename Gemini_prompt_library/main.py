from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import logging

from .config import settings
from .ai.engine import engine, GraphExtractionResult
from .api.routes import router as graph_router

# Setup specialized logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Cognitive Engine Microservice for Nihiltheistic Graph Generation",
    version="1.0.0",
)

# Robust CORS configuration for the dual-node architecture
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to Node.js proxy url
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(graph_router, prefix=f"{settings.API_V1_STR}/graph", tags=["Knowledge Graph"])

class IngestionRequest(BaseModel):
    raw_text: str
    context: str = None

class SynthesisRequest(BaseModel):
    node_id: str
    graph_context: dict

@app.get("/health")
async def health_check():
    return {"status": "void_resonance_stable", "system": "online"}

@app.post(f"{settings.API_V1_STR}/cognitive/extract", response_model=GraphExtractionResult)
async def extract_graph(request: IngestionRequest):
    """
    Ingests raw philosophical text, passes it through the Gemini LLM for reasoning,
    and returns deterministic Node and Edge structures for the React frontend D3 visualization.
    """
    try:
        logger.info(f"Initiating graph extraction for text length: {len(request.raw_text)}")
        result = await engine.extract_graph_elements(request.raw_text, request.context)
        return result
    except ValueError as e:
        logger.error(f"Value Error during extraction: {e}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.exception("Catastrophic collapse during graph extraction")
        raise HTTPException(status_code=500, detail="The void stared back. Processing failed.")

@app.post(f"{settings.API_V1_STR}/cognitive/synthesize")
async def deep_synthesize(request: SynthesisRequest):
    """
    Focuses the LLM on a specific node and its surrounding conceptual topology to
    generate a high-order dialectical synthesis.
    """
    try:
        logger.info(f"Initiating deep synthesis for node: {request.node_id}")
        synthesis_text = await engine.deep_synthesize(request.node_id, request.graph_context)
        return {"synthesis": synthesis_text, "node_id": request.node_id}
    except Exception as e:
        logger.exception("Synthesis failed")
        raise HTTPException(status_code=500, detail="Synthesis collapsed into noise.")

if __name__ == "__main__":
    # If run directly via python main.py
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
