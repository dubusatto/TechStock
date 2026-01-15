import { useEffect, useState } from 'react';

interface Produto {
  id: number;
  nome: string;
  quantidade: number;
  status: string;
}

function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [erro, setErro] = useState('');
  
  const [novoNome, setNovoNome] = useState('');
  const [novaQuantidade, setNovaQuantidade] = useState('');

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = () => {
    fetch('http://127.0.0.1:8000/produtos')
      .then(res => res.json())
      .then(data => setProdutos(data))
      .catch(() => setErro('Erro ao carregar produtos.'));
  };

  const adicionarProduto = () => {
    if (!novoNome || !novaQuantidade) return;

    fetch('http://127.0.0.1:8000/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: novoNome, quantidade: parseInt(novaQuantidade) })
    })
    .then(res => res.json())
    .then(produtoCadastrado => {
      setProdutos([...produtos, produtoCadastrado]);
      setNovoNome('');
      setNovaQuantidade('');
    });
  };

  const removerProduto = (id: number) => {
    fetch(`http://127.0.0.1:8000/produtos/${id}`, { method: 'DELETE' })
    .then(() => {
      setProdutos(produtos.filter(prod => prod.id !== id));
    });
  };

  // --- NOVA FUNÇÃO DE ATUALIZAR ---
  const atualizarQuantidade = (id: number, quantidadeAtual: number, delta: number) => {
    const novaQtd = quantidadeAtual + delta;
    if (novaQtd < 0) return; // Não deixa ficar negativo

    fetch(`http://127.0.0.1:8000/produtos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantidade: novaQtd })
    })
    .then(res => res.json())
    .then(produtoAtualizado => {
      // Atualiza a lista na tela trocando só o produto que mudou
      setProdutos(produtos.map(p => p.id === id ? produtoAtualizado : p));
    });
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>📦 Controle de Estoque TechStock</h1>

      {/* FORMULÁRIO */}
      <div style={{ 
        backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '10px', marginBottom: '30px', display: 'flex', gap: '10px'
      }}>
        <input 
          type="text" placeholder="Nome (ex: Cabo HDMI)" value={novoNome} onChange={e => setNovoNome(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input 
          type="number" placeholder="Qtd" value={novaQuantidade} onChange={e => setNovaQuantidade(e.target.value)}
          style={{ width: '80px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button onClick={adicionarProduto} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          ADICIONAR
        </button>
      </div>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {/* LISTA */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {produtos.map(produto => (
          <div key={produto.id} style={{ 
            padding: '20px', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white'
          }}>
            <div>
              <h3 style={{ margin: 0 }}>{produto.nome}</h3>
              <small style={{ color: '#999' }}>ID: {produto.id}</small>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              
              {/* CONTROLES DE QUANTIDADE */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  onClick={() => atualizarQuantidade(produto.id, produto.quantidade, -1)}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ccc', cursor: 'pointer' }}
                > - </button>
                
                <span style={{ fontSize: '1.2em', fontWeight: 'bold', width: '40px', textAlign: 'center' }}>
                  {produto.quantidade}
                </span>

                <button 
                  onClick={() => atualizarQuantidade(produto.id, produto.quantidade, +1)}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#e3f2fd' }}
                > + </button>
              </div>

              {/* STATUS */}
              <div style={{ width: '100px', textAlign: 'center' }}>
                <span style={{ 
                    color: produto.quantidade < 5 ? '#e74c3c' : '#2ecc71',
                    fontWeight: 'bold', fontSize: '0.8em'
                }}>
                   {produto.status}
                </span>
              </div>

              {/* DELETAR */}
              <button onClick={() => removerProduto(produto.id)} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2em' }}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;