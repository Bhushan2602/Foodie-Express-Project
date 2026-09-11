import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('foodie_user');
    return saved ? JSON.parse(saved) : null;
  });

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('foodie_user', JSON.stringify(userData));
    // Also save token separately if your api.js specifically looks for it
    localStorage.setItem('token', userData.token);
    window.dispatchEvent(new Event('foodie-auth-change'));
  };

  const updateUserName = (name) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, name };
      localStorage.setItem('foodie_user', JSON.stringify(next));
      return next;
    });
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('foodie_user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('foodie-auth-change'));
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, updateUserName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);