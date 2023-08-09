import { AuthProvider, AuthWrapper, Login, Theme } from "components";

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
