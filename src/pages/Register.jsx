import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import styles from './Login.module.css';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(nome, email, senha);
      navigate('/');
    } catch (err) {
      setError('Erro ao criar conta. Email já existe?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <Card title="Criar Conta">
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          
          <Input
            label="Nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          
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
            minLength={6}
            required
          />
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Conta'}
          </Button>
          
          <p className={styles.link}>
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </form>
      </Card>
    </div>
  );
}