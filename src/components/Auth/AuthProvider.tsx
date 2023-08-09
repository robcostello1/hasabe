import { useCallback, useState } from 'react';

import { Session, User } from '@supabase/supabase-js';

import { AuthContext } from './AuthContext';
import { useSession } from './hooks';

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const onSuccess = useCallback(({ user }: Session) => {
    setAuthenticated(true);
    setUser(user);
  }, []);

  useSession({
    onSuccess,
  });

  return (
    <AuthContext.Provider value={{ user, authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
