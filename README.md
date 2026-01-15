# 📦 TechStock - Controle de Estoque Inteligente

Sistema Fullstack para gerenciamento de estoque com alertas automáticos de nível baixo. Desenvolvido para estudo de arquitetura Cliente-Servidor e APIs REST.

## 🚀 Tecnologias

- **Backend:** Python, FastAPI, SQLAlchemy (SQLite)
- **Frontend:** React, TypeScript, Vite
- **Banco de Dados:** SQLite (Arquivo local)

## ⚙️ Como Rodar o Projeto

### 1. Backend (API)
Abra um terminal na pasta raiz e execute:

```bash
cd backend
# Criar ambiente virtual (apenas na primeira vez)
python -m venv venv
# Ativar ambiente (Windows)
.\venv\Scripts\activate
# Instalar dependências
pip install -r requirements.txt
# Rodar servidor
uvicorn main:app --reload

A API ficará disponível em: http://127.0.0.1:8000/docs

2. Frontend (Interface)
Abra um segundo terminal na pasta raiz:

Bash

cd frontend
# Instalar dependências (apenas na primeira vez)
npm install
# Rodar projeto
npm run dev
O site ficará disponível em: http://localhost:5173

✅ Funcionalidades (CRUD)
[x] Listar produtos

[x] Adicionar novo produto

[x] Deletar produto

[x] Atualizar quantidade (+/-)

[x] Alerta visual de estoque baixo (< 5 unidades)