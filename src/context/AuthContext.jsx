import { useState, useEffect } from "react";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  // Load saved candidate from localStorage, default to null if not logged in
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("careerconnect_user");
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {
      // Fallback if parsing fails
    }
    return null;
  });

  // Keep localStorage in sync with user state
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("careerconnect_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("careerconnect_user");
      }
    } catch (error) {
      console.error("Failed to save user session:", error);
    }
  }, [user]);

  // Sign in candidate
  function login(userData) {
    setUser(userData);
  }

  // Sign out candidate
  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
