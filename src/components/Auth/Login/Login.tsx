import "./Login.css";

import { FormContainer, TextFieldElement } from "react-hook-form-mui";

import { Alert, Button } from "@mui/material";

import { useLogin } from "../hooks";

type LoginProps = {
  onSuccess?: () => void;
};

const Login = (_: LoginProps) => {
  const { handleLogin, loginError } = useLogin({});

  return (
    <div className="LoginRoot">
      <FormContainer
        defaultValues={{ email: "", password: "" }}
        onSuccess={handleLogin}
      >
        {loginError && (
          <Alert className="LoginAlert" severity="error">
            {loginError.message}
          </Alert>
        )}

        <TextFieldElement name="email" label="Email" required fullWidth />
        <TextFieldElement
          type="password"
          name="password"
          label="Password"
          required
          fullWidth
        />
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </FormContainer>
    </div>
  );
};

export default Login;
