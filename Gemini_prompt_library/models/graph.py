from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Boolean, JSON, TEXT, ForeignKey, Float
from .base import Base

class User(Base):
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)

class NodeConcept(Base):
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"))
    node_identity: Mapped[str] = mapped_column(String(255), unique=True, index=True) # E.g., 'nihiltheism'
    label: Mapped[str] = mapped_column(String(255))
    cat: Mapped[str] = mapped_column(String(50)) # pillar, mystic, nihilist, general
    echo: Mapped[str] = mapped_column(String(100))
    desc: Mapped[str] = mapped_column(TEXT)
    radius: Mapped[int] = mapped_column(default=15)
    
class EdgeConnection(Base):
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"))
    source_identity: Mapped[str] = mapped_column(String, ForeignKey("nodeconcepts.node_identity"))
    target_identity: Mapped[str] = mapped_column(String, ForeignKey("nodeconcepts.node_identity"))
    strength: Mapped[float] = mapped_column(Float, default=0.5)
