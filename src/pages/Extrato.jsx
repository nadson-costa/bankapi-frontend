import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useConta } from '../context/ContaContext';
import api from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import styles from './Extrato.module.css';

export default function Extrato() {
  const { conta } = useConta();
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (conta) {
      loadExtrato();
    }
  }, [conta]);

  async function loadExtrato() {
    try {
      const response = await api.get(`/contas/${conta.id}/extrato`);
      setTransacoes(response.data);
    } catch (err) {
      setError('Erro ao carregar extrato');
    } finally {
      setLoading(false);
    }
  }

  function formatMoney(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getTipoLabel(transacao) {
    if (transacao.tipo === 'DEPOSITO') return 'Depósito';
    if (transacao.tipo === 'SAQUE') return 'Saque';
    if (transacao.tipo === 'TRANSFERENCIA') {
      if (transacao.contaOrigemId === conta.id) {
        return `Transferência para ${transacao.nomeDestino}`;
      } else {
        return `Transferência de ${transacao.nomeOrigem}`;
      }
    }
    return transacao.tipo;
  }

  
  function getTipoClass(tipo, contaOrigemId) {
    if (tipo === 'DEPOSITO') return styles.entrada;
    if (tipo === 'SAQUE') return styles.saida;
    if (tipo === 'TRANSFERENCIA') {
      return contaOrigemId === conta.id ? styles.saida : styles.entrada;
    }
    return '';
  }


  function isEntrada(tipo, contaOrigemId) {
    if (tipo === 'DEPOSITO') return true;
    if (tipo === 'SAQUE') return false;
    if (tipo === 'TRANSFERENCIA') {
      return contaOrigemId !== conta.id;
    }
    return false;
  }

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Extrato</h1>
        <Link to="/">
          <Button variant="secondary">Voltar</Button>
        </Link>
      </div>

      {error && <p className={styles.error}>{error}</p>}


      <div className={styles.list}>
        {transacoes.length === 0 ? (
          <Card>
            <p className={styles.empty}>Nenhuma transação encontrada</p>
          </Card>
        ) : (
          transacoes.map((transacao) => (
            <Card key={transacao.id}>
              <div className={styles.transacao}>
                <div className={styles.info}>
                  <span className={styles.tipo}>{getTipoLabel(transacao)}</span>
                  <span className={styles.descricao}>
                    {transacao.descricao || 'Sem descrição'}
                  </span>
                  <span className={styles.data}>{formatDate(transacao.createdAt)}</span>
                </div>
                <span className={`${styles.valor} ${getTipoClass(transacao.tipo, transacao.contaOrigemId)}`}>
                  {isEntrada(transacao.tipo, transacao.contaOrigemId) ? '+' : '-'}
                  {formatMoney(transacao.valor)}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}