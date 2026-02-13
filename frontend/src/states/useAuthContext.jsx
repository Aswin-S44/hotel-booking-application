import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const AuthContext = createContext(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

const authSessionKey = "_BOOKING_AUTH_KEY_";

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([authSessionKey]);

  const getSession = () => {
    const fetchedCookie = cookies[authSessionKey];
    if (!fetchedCookie) return undefined;
    return typeof fetchedCookie === "string" ? fetchedCookie : fetchedCookie;
  };

  const [user, setUser] = useState(getSession());

  const saveSession = (userData) => {
    setCookie(authSessionKey, JSON.stringify(userData), { path: "/" });
    setUser(userData);
  };

  const removeSession = () => {
    removeCookie(authSessionKey, { path: "/" });
    setUser(undefined);
    navigate("/auth/sign-in");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!cookies[authSessionKey],
        saveSession,
        removeSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
