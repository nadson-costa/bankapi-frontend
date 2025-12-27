import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import styles from './Transacao.module.css';

export default function Saque() {
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/transacoes/saque', {
        contaId: 1,
        valor: parseFloat(valor),
        descricao
      });
      setSuccess('Saque realizado com sucesso!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError('Erro ao realizar saque. Saldo insuficiente?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <Card title="Sacar">
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          
          <Input
            label="Valor (R$)"
            type="number"
            step="0.01"
            min="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
          
          <Input
            label="Descrição (opcional)"
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          
          <div className={styles.buttons}>
            <Link to="/">
              <Button type="button" variant="secondary">Cancelar</Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sacando...' : 'Sacar'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}