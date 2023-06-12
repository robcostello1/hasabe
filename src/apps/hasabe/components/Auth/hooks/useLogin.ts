import { useCallback, useContext, useState } from "react";

import { AuthError } from "@supabase/supabase-js";

import { supabaseClient } from "../../../utils/db";
import { AuthContext } from "../AuthContext";

type UseLoginProps = {
  onSuccess?: () => void;
};

export const useLogin = ({ onSuccess }: UseLoginProps) => {
  const [loginError, setLoginError] = useState<AuthError>();
  const { setAuthenticated } = useContext(AuthContext);

  const handleLogin = useCallback(
    async (credentials: { email: string; password: string }) => {
      const { error } = await supabaseClient.auth.signInWithPassword(
        credentials
      );

      if (error) {
        setLoginError(error);
      } else {
        onSuccess?.();
        setAuthenticated(true);
        setLoginError(undefined);
      }
    },
    [onSuccess, setAuthenticated]
  );

  return {
    loginError,
    handleLogin,
  };
};
