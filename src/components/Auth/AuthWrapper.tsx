import { ReactNode, useContext } from "react";

import { AuthContext } from "./AuthContext";

type AuthWrapperProps = {
  children: ReactNode;
  unauthenticatedFallback: ReactNode;
};

const AuthWrapper = ({
  children,
  unauthenticatedFallback,
}: AuthWrapperProps) => {
  const { authenticated } = useContext(AuthContext);

  return <>{authenticated ? children : unauthenticatedFallback}</>;
};

export default AuthWrapper;
