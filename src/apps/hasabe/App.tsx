import Theme from "../../components/Theme";
import { AuthProvider } from "./components/Auth/AuthContext";
import AuthWrapper from "./components/Auth/AuthWrapper";
import Login from "./components/Auth/Login";
import TaskUi from "./components/TaskUi";

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
