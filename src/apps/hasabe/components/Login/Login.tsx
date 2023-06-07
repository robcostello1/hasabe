import "./Login.css";

import { useCallback } from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";

import { Button } from "@mui/material";

import { supabaseClient } from "../../utils/db";

type LoginProps = {
  onSuccess: () => void;
};

const Login = ({ onSuccess }: LoginProps) => {
  const handleSubmit = useCallback(async (values: any) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword(
      values
    );

    if (data.session) {
      onSuccess();
    }
  }, []);

  return (
    <div className="LoginRoot">
      <FormContainer
        defaultValues={{ email: "", password: "" }}
        onSuccess={handleSubmit}
      >
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
