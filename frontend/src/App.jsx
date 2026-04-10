import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ManagerPage from './pages/ManagerPage';
import DriverPage from './pages/DriverPage';
import HomePage from './pages/HomePage';
import AdvantagesPage from './pages/AdvantagesPage';
import ContactPage from './pages/ContactPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './state/AuthContext';

export default function App() {
  const { user } = useAuth();
  const hasValidRole = user?.role === 'MANAGER' || user?.role === 'DRIVER';

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/avantages" element={<AdvantagesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/espace-client"
        element={
          user && hasValidRole ? (
            <Navigate to={user.role === 'MANAGER' ? '/manager' : '/driver'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/manager"
        element={
          <ProtectedRoute role="MANAGER">
            <ManagerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver"
        element={
          <ProtectedRoute role="DRIVER">
            <DriverPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          user && hasValidRole ? (
            <Navigate to={user.role === 'MANAGER' ? '/manager' : '/driver'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}
