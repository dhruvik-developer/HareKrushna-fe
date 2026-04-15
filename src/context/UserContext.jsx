import { createContext, useState } from "react";
import tokenService from "../services/tokenService";

// Create UserContext
const UserContext = createContext();
const USERNAME_STORAGE_KEY = "username";

// UserProvider Component
// eslint-disable-next-line react/prop-types
const UserProvider = ({ children }) => {
  const [token, setToken] = useState(() => tokenService.getToken());
  const [username, setUsername] = useState(() =>
    typeof window !== "undefined"
      ? window.localStorage.getItem(USERNAME_STORAGE_KEY)
      : null
  );

  // Function to log in and store the token
  const login = (accessToken, username) => {
    tokenService.setToken(accessToken);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(USERNAME_STORAGE_KEY, username);
    }
    setToken(accessToken);
    setUsername(username);
  };

  // Function to log out and clear stored token
  const logout = () => {
    tokenService.setToken(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(USERNAME_STORAGE_KEY);
    }
    setToken(null);
    setUsername(null);
  };

  return (
    <UserContext.Provider value={{ token, username, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
