import { createContext, useState } from "react";

import { useSession } from "./hooks";

// Set up react context
export const AuthContext = createContext<{
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
}>({
  authenticated: false,
  setAuthenticated: () => {},
});

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authenticated, setAuthenticated] = useState(false);

  useSession({ onSuccess: () => setAuthenticated(true) });

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
