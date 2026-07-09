import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedEmail = localStorage.getItem('auth_email');
    const savedId = localStorage.getItem('auth_uid'); // Fetching stored ID
    return savedToken ? { token: savedToken, email: savedEmail, id: savedId } : null;
  });

  const login = (token, email, id) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_email', email);
    localStorage.setItem('auth_uid', id); // Storing user ID
    setUser({ token, email, id });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_email');
    localStorage.removeItem('auth_uid');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);