import { createContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

// const [user, loading] = useAuthState(auth)

// export const AuthContext = createContext({
//   isAuthenticated: user,
//   setIsAuthenticated: () => {},
// });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // your login/logout logic

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
