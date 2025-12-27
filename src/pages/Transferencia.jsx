import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useConta } from '../context/ContaContext';
import api from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import styles from './Transacao.module.css';

export default function Transferencia() {
  const { conta, reloadConta } = useConta();
  const [contaDestino, setContaDestino] = useState('');
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
      await api.post('/transacoes/transferencia', {
        contaOrigemId: conta.id,
        contaDestinoId: parseInt(contaDestino),
        valor: parseFloat(valor),
        descricao
      });
      setSuccess('Transferência realizada com sucesso!');
      await reloadConta();
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError('Erro ao realizar transferência. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <Card title="Transferir">
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          
          <Input
            label="ID da Conta Destino"
            type="number"
            min="1"
            value={contaDestino}
            onChange={(e) => setContaDestino(e.target.value)}
            required
          />
          
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
              {loading ? 'Transferindo...' : 'Transferir'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}