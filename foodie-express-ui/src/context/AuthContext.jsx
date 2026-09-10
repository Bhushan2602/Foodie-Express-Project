import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('foodie_user');
    return saved ? JSON.parse(saved) : null;
  });

  const loginUser = (userData) => {
    // ✅ Expecting userData to have { token, email, name, role }
    setUser(userData);
    localStorage.setItem('foodie_user', JSON.stringify(userData));
    // Also save token separately if your api.js specifically looks for it
    localStorage.setItem('token', userData.token);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('foodie_user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);