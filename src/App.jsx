import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ContaProvider } from './context/ContaContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Deposito from './pages/Deposito';
import Saque from './pages/Saque';
import Transferencia from './pages/Transferencia';
import Extrato from './pages/Extrato';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return user ? <Navigate to="/" /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/registro" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/deposito" element={<PrivateRoute><Deposito /></PrivateRoute>} />
      <Route path="/saque" element={<PrivateRoute><Saque /></PrivateRoute>} />
      <Route path="/transferencia" element={<PrivateRoute><Transferencia /></PrivateRoute>} />
      <Route path="/extrato" element={<PrivateRoute><Extrato /></PrivateRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContaProvider>
          <AppRoutes />
        </ContaProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}