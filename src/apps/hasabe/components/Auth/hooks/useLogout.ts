import { useCallback, useContext, useState } from "react";

import { AuthError } from "@supabase/supabase-js";

import { supabaseClient } from "../../../utils/db";
import { AuthContext } from "../AuthContext";

type UseLogoutProps = {
  onSuccess?: () => void;
};

export const useLogout = ({ onSuccess }: UseLogoutProps) => {
  const { setAuthenticated } = useContext(AuthContext);

  const [logoutError, setLogoutError] = useState<AuthError>();

  const handleLogout = useCallback(async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      setLogoutError(error);
    } else {
      onSuccess?.();
      setAuthenticated(false);
      setLogoutError(undefined);
    }
  }, []);

  return {
    logoutError,
    handleLogout,
  };
};
