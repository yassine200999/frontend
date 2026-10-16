import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  function setUser(nextUser) {
    setUserState(nextUser);
    if (nextUser) {
      localStorage.setItem("currentUser", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
    }
  }

  const value = useMemo(
    () => ({ user, setUser, isAuthenticated: Boolean(user && localStorage.getItem("token")) }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider.");
  }
  return context;
}
