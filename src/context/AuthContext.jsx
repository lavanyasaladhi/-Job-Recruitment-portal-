import { useState, useEffect } from "react";
import { AuthContext } from "./auth-context";

// Default demo candidate profile matching db.json candidate #1
const DEFAULT_USER = {
  id: 1,
  name: "Suren Sharma",
  email: "suren@example.com",
  phone: "+91 9876543210",
  role: "candidate", // 'candidate' | 'recruiter'
  experience: 2,
  skills: ["React", "JavaScript", "HTML/CSS"],
  location: "Hyderabad",
  resume: "suren_resume.pdf",
};

export function AuthProvider({ children }) {
  // Load saved user from localStorage or use default demo user
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("careerconnect_user");
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {
      // Fallback if parsing fails
    }
    return DEFAULT_USER;
  });

  // Save user changes to localStorage
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

  // Sign in or update user profile
  function login(userData) {
    setUser(userData);
  }

  // Sign out user
  function logout() {
    setUser(null);
  }

  // Helper to easily switch role between 'candidate' and 'recruiter'
  function switchRole(newRole) {
    if (!user) {
      setUser({
        name: "Suren Sharma",
        email: "suren@example.com",
        role: newRole,
      });
      return;
    }
    setUser({
      ...user,
      role: newRole,
    });
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}
