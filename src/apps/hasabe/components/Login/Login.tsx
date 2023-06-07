import "./Login.css";

import { FormContainer, TextFieldElement } from "react-hook-form-mui";

import { Button } from "@mui/material";

const Login = () => {
  return (
    <div className="LoginRoot">
      <FormContainer
        defaultValues={{ email: "", password: "" }}
        onSuccess={console.log}
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
