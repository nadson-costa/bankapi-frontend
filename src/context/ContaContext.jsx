import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const ContaContext = createContext();

export function ContaProvider({ children }) {
  const { user } = useAuth();
  const [conta, setConta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConta();
    } else {
      setConta(null);
      setLoading(false);
    }
  }, [user]);

  async function loadConta() {
    try {
      const response = await api.get('/contas/minha');
      setConta(response.data);
    } catch (err) {
      console.error('Erro ao carregar conta:', err);
      setConta(null);
    } finally {
      setLoading(false);
    }
  }

  async function reloadConta() {
    setLoading(true);
    await loadConta();
  }

  return (
    <ContaContext.Provider value={{ conta, loading, reloadConta }}>
      {children}
    </ContaContext.Provider>
  );
}

export function useConta() {
  return useContext(ContaContext);
}