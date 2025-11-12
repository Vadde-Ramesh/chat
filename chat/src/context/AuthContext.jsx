import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [tokenExpiryTimeout, setTokenExpiryTimeout] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("chatAppUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      scheduleLogout();
    }
  }, []);

  const loginUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem("chatAppUser", JSON.stringify(user));
    scheduleLogout();
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("chatAppUser");
    if (tokenExpiryTimeout) clearTimeout(tokenExpiryTimeout);
  };

  const scheduleLogout = () => {
    if (tokenExpiryTimeout) clearTimeout(tokenExpiryTimeout);
    const timeout = setTimeout(() => {
      logoutUser();
      alert("Session expired! Please login again.");
    }, 60 * 1000);
    setTokenExpiryTimeout(timeout);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
