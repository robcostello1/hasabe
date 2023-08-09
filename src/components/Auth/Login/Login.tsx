import "./Login.css";

import { useEffect, useState } from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";

import { Alert, Box, Button } from "@mui/material";
import { AuthError } from "@supabase/supabase-js";

import { useLogin, useMagicLink } from "../hooks";

type LoginProps = {
  onSuccess?: () => void;
};

const LOGIN_STRATEGY = {
  PASSWORD: "password",
  MAGIC_LINK: "magicLink",
};

const Login = (_: LoginProps) => {
  const [loginStrategy, setLoginStrategy] = useState<
    (typeof LOGIN_STRATEGY)[keyof typeof LOGIN_STRATEGY]
  >(LOGIN_STRATEGY.PASSWORD);

  const { handleLogin, loginError } = useLogin({});
  const { handleMagicLink, magicLinkError } = useMagicLink({});

  const [error, setError] = useState<AuthError | undefined>();

  useEffect(() => {
    if (loginError) {
      setError(loginError);
    }
    if (magicLinkError) {
      setError(magicLinkError);
    }
  }, [loginError, magicLinkError]);

  useEffect(() => {
    setError(undefined);
  }, [loginStrategy]);

  return (
    <div className="LoginRoot">
      <FormContainer
        defaultValues={{ email: "", password: "" }}
        onSuccess={
          loginStrategy === LOGIN_STRATEGY.MAGIC_LINK
            ? handleMagicLink
            : handleLogin
        }
      >
        {error && (
          <Alert className="LoginAlert" severity="error">
            {error.message}
          </Alert>
        )}

        <TextFieldElement name="email" label="Email" required fullWidth />
        {loginStrategy === LOGIN_STRATEGY.PASSWORD && (
          <TextFieldElement
            type="password"
            name="password"
            label="Password"
            required
            fullWidth
          />
        )}
        <Box display="flex" justifyContent="space-between">
          <Button type="submit" variant="contained">
            {loginStrategy === LOGIN_STRATEGY.PASSWORD
              ? "Submit"
              : "Request magic link"}
          </Button>
          {loginStrategy === LOGIN_STRATEGY.PASSWORD && (
            <Button
              variant="text"
              onClick={() => setLoginStrategy(LOGIN_STRATEGY.MAGIC_LINK)}
            >
              Use magic link
            </Button>
          )}
          {loginStrategy === LOGIN_STRATEGY.MAGIC_LINK && (
            <Button
              variant="text"
              onClick={() => setLoginStrategy(LOGIN_STRATEGY.PASSWORD)}
            >
              Use password
            </Button>
          )}
        </Box>
      </FormContainer>
    </div>
  );
};

export default Login;
