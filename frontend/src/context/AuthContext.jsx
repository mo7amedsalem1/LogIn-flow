import { createContext, useContext, useEffect, useState } from "react";

import { authService } from "../services/authService";
import { pendingTwoFactorStorage, tokenStorage } from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(tokenStorage.get());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingTwoFactor, setPendingTwoFactor] = useState(
    pendingTwoFactorStorage.get(),
  );

  useEffect(() => {
    let ignore = false;

    const hydrateAuth = async () => {
      const storedToken = tokenStorage.get();

      if (!storedToken) {
        if (!ignore) {
          setLoading(false);
        }
        return;
      }

      try {
        const response = await authService.getCurrentUser();

        if (!ignore) {
          setToken(storedToken);
          setUser(response.user);
        }
      } catch {
        tokenStorage.clear();

        if (!ignore) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    hydrateAuth();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const handleSessionExpiry = () => {
      tokenStorage.clear();
      pendingTwoFactorStorage.clear();
      setToken(null);
      setUser(null);
      setPendingTwoFactor(null);
      setLoading(false);
    };

    window.addEventListener("auth:expired", handleSessionExpiry);

    return () => {
      window.removeEventListener("auth:expired", handleSessionExpiry);
    };
  }, []);

  const completeLogin = ({ accessToken, user: authenticatedUser }) => {
    tokenStorage.set(accessToken);
    pendingTwoFactorStorage.clear();
    setPendingTwoFactor(null);
    setToken(accessToken);
    setUser(authenticatedUser);
  };

  const storePendingTwoFactor = (payload) => {
    pendingTwoFactorStorage.set(payload);
    setPendingTwoFactor(payload);
  };

  const clearPendingTwoFactor = () => {
    pendingTwoFactorStorage.clear();
    setPendingTwoFactor(null);
  };

  const logout = () => {
    tokenStorage.clear();
    pendingTwoFactorStorage.clear();
    setToken(null);
    setUser(null);
    setPendingTwoFactor(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        pendingTwoFactor,
        isAuthenticated: Boolean(token && user),
        completeLogin,
        storePendingTwoFactor,
        clearPendingTwoFactor,
        logout,
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
