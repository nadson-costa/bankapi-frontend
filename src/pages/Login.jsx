import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, senha);
      navigate('/');
    } catch (err) {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <Card title="Entrar">
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
          
          <p className={styles.link}>
            Não tem conta? <Link to="/registro">Criar conta</Link>
          </p>
        </form>
      </Card>
    </div>
  );
}