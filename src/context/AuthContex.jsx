import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function readStoreduser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [user, setUser] = useState(readStoreduser());

  function saveSession(newToken, newUser) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  function clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }
  const value = {
    token,
    user,
    saveSession,
    clearSession,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}