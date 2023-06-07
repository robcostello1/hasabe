import Theme from "../../components/Theme";
import TaskUi from "./components/TaskUi";

const App = () => {
  return (
    <Theme>
      <TaskUi debug={true} />
    </Theme>
  );
};

export default App;
