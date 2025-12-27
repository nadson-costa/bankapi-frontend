import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);


  async function login(email, senha) {
    const response = await api.post('/auth/login', { email, senha });
    const { token, nome } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ email, nome }));
    setUser({ email, nome });
    
    return response.data;
  }
  

  async function register(nome, email, senha) {
    const response = await api.post('/auth/registro', { nome, email, senha });
    const { token } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ email, nome }));
    setUser({ email, nome });
    
    return response.data;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}