from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List

# =======================
# 1. CONFIGURAÇÃO DO BANCO
# =======================
# Cria o arquivo do banco na pasta atual
SQLALCHEMY_DATABASE_URL = "sqlite:///./techstock.db"
# Cria a conexão
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
# Cria a fábrica de sessões (quem vai fazer as operações)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base para criar as tabelas
Base = declarative_base()

# =======================
# 2. MODELO DO BANCO (A Tabela)
# =======================
class ProdutoDB(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    quantidade = Column(Integer)
    status = Column(String)  # Ex: "Em Estoque", "Acabando"

# Cria as tabelas no banco de verdade agora
Base.metadata.create_all(bind=engine)

# =======================
# 3. SCHEMA (Validação de Dados)
# =======================
# É isso que o Frontend DEVE mandar
class ProdutoCreate(BaseModel):
    nome: str
    quantidade: int

# É isso que o Backend responde (inclui o ID)
class ProdutoResponse(ProdutoCreate):
    id: int
    status: str
    
    class Config:
        from_attributes = True

# Classe para validar quando vamos atualizar só a quantidade
class ProdutoUpdate(BaseModel):
    quantidade: int

# =======================
# 4. APLICAÇÃO
# =======================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Função para pegar o banco de dados e fechar depois
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ROTAS ---

# Rota para LISTAR produtos
@app.get("/produtos", response_model=List[ProdutoResponse])
def listar_produtos(db: Session = Depends(get_db)):
    return db.query(ProdutoDB).all()

# Rota para CRIAR produto
@app.post("/produtos", response_model=ProdutoResponse)
def criar_produto(produto: ProdutoCreate, db: Session = Depends(get_db)):
    # Lógica simples de status
    status_calculado = "Em Estoque"
    if produto.quantidade < 5:
        status_calculado = "Baixo Estoque"

    # Cria o objeto do banco
    novo_produto = ProdutoDB(
        nome=produto.nome, 
        quantidade=produto.quantidade,
        status=status_calculado
    )
    
    # Salva no banco
    db.add(novo_produto)
    db.commit()
    db.refresh(novo_produto)
    return novo_produto

@app.delete("/produtos/{id}")
def remover_produto(id: int, db: Session = Depends(get_db)):
    # Busca o produto pelo ID
    produto = db.query(ProdutoDB).filter(ProdutoDB.id == id).first()
    
    # Se não achar, avisa que deu erro
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    # Deleta e salva a mudança
    db.delete(produto)
    db.commit()
    return {"mensagem": "Produto removido!"}

# --- ROTA DE ATUALIZAR (PUT) ---
@app.put("/produtos/{id}")
def atualizar_estoque(id: int, item: ProdutoUpdate, db: Session = Depends(get_db)):
    # 1. Busca o produto
    produto = db.query(ProdutoDB).filter(ProdutoDB.id == id).first()
    
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    # 2. Atualiza a quantidade
    produto.quantidade = item.quantidade
    
    # 3. Recalcula o status automaticamente (Regra de Negócio)
    if produto.quantidade < 5:
        produto.status = "Baixo Estoque"
    else:
        produto.status = "Em Estoque"
        
    # 4. Salva
    db.commit()
    db.refresh(produto)
    return produto