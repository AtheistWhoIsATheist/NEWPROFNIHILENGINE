from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ..models.graph import NodeConcept, EdgeConnection
from .dependencies import get_db
from pydantic import BaseModel

router = APIRouter()

class NodeCreate(BaseModel):
    user_id: str
    node_identity: str
    label: str
    cat: str
    echo: str
    desc: str

class EdgeCreate(BaseModel):
    user_id: str
    source_identity: str
    target_identity: str
    strength: float = 0.5

@router.get("/nodes", response_model=List[dict])
async def get_all_nodes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(NodeConcept))
    nodes = result.scalars().all()
    return [{"id": n.node_identity, "label": n.label, "cat": n.cat, "echo": n.echo, "desc": n.desc, "radius": n.radius} for n in nodes]

@router.post("/nodes")
async def create_node(node: NodeCreate, db: AsyncSession = Depends(get_db)):
    db_node = NodeConcept(**node.dict())
    db.add(db_node)
    try:
        await db.commit()
        await db.refresh(db_node)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Node creation failed. Check identity constraint.")
    return {"status": "success", "node_id": db_node.node_identity}

@router.get("/edges", response_model=List[dict])
async def get_all_edges(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(EdgeConnection))
    edges = result.scalars().all()
    return [{"source": e.source_identity, "target": e.target_identity, "strength": e.strength} for e in edges]

@router.post("/edges")
async def create_edge(edge: EdgeCreate, db: AsyncSession = Depends(get_db)):
    db_edge = EdgeConnection(**edge.dict())
    db.add(db_edge)
    await db.commit()
    return {"status": "success"}
