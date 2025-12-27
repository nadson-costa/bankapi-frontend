import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [conta, setConta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadConta();
  }, []);

  async function loadConta() {
    try {
      const response = await api.get('/contas/1');
      setConta(response.data);
    } catch (err) {
      setError('Erro ao carregar conta');
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

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>BankAPI</h1>
        <div className={styles.userInfo}>
          <span>Olá, {user?.nome}</span>
          <Button variant="secondary" onClick={logout}>Sair</Button>
        </div>
      </header>

      <main className={styles.main}>
        {error && <p className={styles.error}>{error}</p>}

        <Card>
          <div className={styles.balance}>
            <span className={styles.balanceLabel}>Saldo disponível</span>
            <span className={styles.balanceValue}>
              {conta ? formatMoney(conta.saldo) : 'R$ 0,00'}
            </span>
            <span className={styles.accountNumber}>
              Conta: {conta?.numeroConta}
            </span>
          </div>
        </Card>

        <div className={styles.actions}>
          <Link to="/deposito">
            <Card>
              <div className={styles.action}>
                <span>Depositar</span>
              </div>
            </Card>
          </Link>

          <Link to="/saque">
            <Card>
              <div className={styles.action}>
                <span>Sacar</span>
              </div>
            </Card>
          </Link>

          <Link to="/transferencia">
            <Card>
              <div className={styles.action}>
                <span>Transferir</span>
              </div>
            </Card>
          </Link>

          <Link to="/extrato">
            <Card>
              <div className={styles.action}>
                <span>Extrato</span>
              </div>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}