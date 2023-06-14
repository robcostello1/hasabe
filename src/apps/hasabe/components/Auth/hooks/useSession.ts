import { useEffect, useState } from "react";

import { Session } from "@supabase/supabase-js";

import { supabaseClient } from "../../../utils/db";

type UseSessionProps = {
  onSuccess?: (session: Session) => void;
};

export const useSession = ({ onSuccess }: UseSessionProps) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabaseClient.auth.getSession();

      if (data.session === null) {
        if (error) {
          console.error(error);
        }

        setSession(null);
        return;
      }
      onSuccess?.(data.session);
      setSession(data.session);
    })();
  }, [onSuccess]);

  return session;
};
