import { createContext, useContext, useState, useEffect } from "react";
import { authAPI, businessAPI } from "../api/auth";
import { setAuthToken } from "../api/axios";

const AuthContext = createContext(null);

function isTokenExpired(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem("token");
    const storedToken = localStorage.getItem("ii_token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser && !isTokenExpired(storedToken)) {
      setAuthToken(storedToken);
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      localStorage.removeItem("ii_token");
      localStorage.removeItem("user");
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const data = res.data.data;
    setAuthToken(data.accessToken);
    localStorage.setItem("user", JSON.stringify(data));
    setToken(data.accessToken);
    setUser(data);
    return data;
  };

  const setupBusiness = async (businessData) => {
    const res = await businessAPI.setup(businessData);
    const updatedUser = { ...user, businessSetupCompleted: true };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    return res.data.data;
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;
  const isBusinessSetupComplete = user?.businessSetupCompleted;
  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        setupBusiness,
        logout,
        isAuthenticated,
        isBusinessSetupComplete,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
