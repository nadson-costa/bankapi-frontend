import { useAuth } from '../context/AuthContext';
import { useConta } from '../context/ContaContext';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { conta, loading } = useConta();

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
        {!conta ? (
          <Card>
            <p className={styles.error}>Conta não encontrada</p>
          </Card>
        ) : (
          <>
            <Card>
              <div className={styles.balance}>
                <span className={styles.balanceLabel}>Saldo disponível</span>
                <span className={styles.balanceValue}>
                  {formatMoney(conta.saldo)}
                </span>
                <span className={styles.accountNumber}>
                  Conta: {conta.numeroConta} | ID: {conta.id}
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
          </>
        )}
      </main>
    </div>
  );
}