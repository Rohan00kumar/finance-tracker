import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ name: 'Guest User', username: 'Guest User', email: 'guest@example.com' });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    return { success: true };
  };

  const register = async (name, email, password) => {
    return { success: true, message: 'Registration successful!' };
  };

  const logout = () => {
    // No-op since we run in single user mode
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
