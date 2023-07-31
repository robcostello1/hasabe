import { createContext } from 'react';

import { User } from '@supabase/supabase-js';

export const AuthContext = createContext<{
  user: User | null;
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
}>({
  user: null,
  authenticated: false,
  setAuthenticated: () => {},
});
