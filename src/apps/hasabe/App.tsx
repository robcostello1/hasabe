import { Theme } from "components";

import { AuthProvider, AuthWrapper, Login } from "./components/Auth";
import { TaskUi } from "./components/Tasks";

const App = () => {
  return (
    <AuthProvider>
      <Theme>
        <AuthWrapper unauthenticatedFallback={<Login />}>
          <TaskUi />
        </AuthWrapper>
      </Theme>
    </AuthProvider>
  );
};

export default App;
