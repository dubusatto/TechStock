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