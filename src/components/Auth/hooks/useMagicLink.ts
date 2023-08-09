import { useCallback, useContext, useState } from "react";

import { AuthError } from "@supabase/supabase-js";

import { supabaseClient } from "../../../apps/hasabe/utils/db";
import { AuthContext } from "../AuthContext";

type UseMagicLinkProps = {
  onSuccess?: () => void;
};

export const useMagicLink = ({ onSuccess }: UseMagicLinkProps) => {
  const [magicLinkError, setMagicLinkError] = useState<AuthError>();
  const { setAuthenticated } = useContext(AuthContext);

  const handleMagicLink = useCallback(
    async (credentials: { email: string; password: string }) => {
      const { error } = await supabaseClient.auth.signInWithOtp(credentials);

      if (error) {
        setMagicLinkError(error);
      } else {
        onSuccess?.();
        setAuthenticated(true);
        setMagicLinkError(undefined);
      }
    },
    [onSuccess, setAuthenticated]
  );

  return {
    magicLinkError,
    handleMagicLink,
  };
};
