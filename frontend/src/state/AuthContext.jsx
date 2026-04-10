import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function normalizeRole(role) {
  if (!role) return null;
  if (role === 'MANAGER' || role === 'DRIVER') return role;
  if (role === 'ROLE_MANAGER') return 'MANAGER';
  if (role === 'ROLE_DRIVER') return 'DRIVER';
  return null;
}

function readStoredUser() {
  const username = localStorage.getItem('username');
  const role = normalizeRole(localStorage.getItem('role'));
  const fullName = localStorage.getItem('fullName');
  if (!username || !role) return null;
  return { username, role, fullName };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = (authResponse) => {
    const normalizedRole = normalizeRole(authResponse.role);
    if (!normalizedRole) {
      localStorage.clear();
      setUser(null);
      return;
    }

    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('username', authResponse.username);
    localStorage.setItem('role', normalizedRole);
    localStorage.setItem('fullName', authResponse.fullName);
    setUser({
      username: authResponse.username,
      role: normalizedRole,
      fullName: authResponse.fullName
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
