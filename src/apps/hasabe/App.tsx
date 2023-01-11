import { CircularProgress } from "@mui/material";
import Theme from "../../components/Theme";
import TaskUi from "./TaskUi";
import useDatabaseMetadata from "./utils/useDatabaseMetadata";

const App = () => {
  const [databaseInstance, metadataInfo] = useDatabaseMetadata();

  return (
    <Theme>
      {metadataInfo === null || databaseInstance === null ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        <TaskUi
          metadataInfo={metadataInfo}
          databaseInstance={databaseInstance}
        />
      )}
    </Theme>
  );
};

export default App;
