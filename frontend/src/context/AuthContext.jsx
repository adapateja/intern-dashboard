import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("authUser", JSON.stringify(userData));
    localStorage.setItem("authToken", jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  useEffect(() => {
    // Could add token validation here in real-world
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
