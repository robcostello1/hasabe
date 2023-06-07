import { useState } from "react";

import Theme from "../../components/Theme";
import Login from "./components/Login";
import TaskUi from "./components/TaskUi";

const App = () => {
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  return <Theme>{userAuthenticated ? <TaskUi /> : <Login />}</Theme>;
};

export default App;
