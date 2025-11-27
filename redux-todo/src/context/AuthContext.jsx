import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(() => {
    const stored = localStorage.getItem("loggedInUserId");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (userId) {
      localStorage.setItem("loggedInUserId", JSON.stringify(userId));
    } else {
      localStorage.removeItem("loggedInUserId");
    }
  }, [userId]);

  const login = (id) => setUserId(id);
  const logout = () => setUserId(null);

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
