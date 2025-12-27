import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import styles from './Extrato.module.css';

export default function Extrato() {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadExtrato();
  }, []);

  async function loadExtrato() {
    try {
      const response = await api.get('/contas/1/extrato');
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

  function getTipoLabel(tipo) {
    const labels = {
      DEPOSITO: 'Depósito',
      SAQUE: 'Saque',
      TRANSFERENCIA: 'Transferência'
    };
    return labels[tipo] || tipo;
  }

  function getTipoClass(tipo, contaOrigemId) {
    if (tipo === 'DEPOSITO') return styles.entrada;
    if (tipo === 'SAQUE') return styles.saida;
    if (tipo === 'TRANSFERENCIA') {
      return contaOrigemId === 1 ? styles.saida : styles.entrada;
    }
    return '';
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
                  <span className={styles.tipo}>{getTipoLabel(transacao.tipo)}</span>
                  <span className={styles.descricao}>
                    {transacao.descricao || 'Sem descrição'}
                  </span>
                  <span className={styles.data}>{formatDate(transacao.createdAt)}</span>
                </div>
                <span className={`${styles.valor} ${getTipoClass(transacao.tipo, transacao.contaOrigemId)}`}>
                  {transacao.tipo === 'DEPOSITO' || (transacao.tipo === 'TRANSFERENCIA' && transacao.contaOrigemId !== 1) ? '+' : '-'}
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