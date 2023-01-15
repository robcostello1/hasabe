import { useKeyPressEvent } from "react-use";
import { Button, Card, CardActions, CardContent, Dialog } from "@mui/material";
import { CallSplit, Close, Edit } from "@mui/icons-material";

import AddTask from "./AddTask";
import CardButton from "./CardButton";
import { getColor, moveTaskDown, moveTaskUp } from "../utils/utils";
import { useTaskMethods } from "../utils/useTaskMethods";

import "./TaskUi.css";
import { useMemo } from "react";

function TaskUi() {
  const {
    addModalOpen,
    currentTaskId,
    mode,
    tasks,
    handleCloseModal,
    handleDefaultSubmit,
    handleRemoveTask,
    handleSplitSubmit,
    setAddModalOpen,
    setCurrentTaskId,
    setMode,
    setTasks,
  } = useTaskMethods();

  useKeyPressEvent("ArrowUp", () => {
    if (currentTaskId) {
      setTasks(moveTaskUp(tasks || [], currentTaskId));
    }
  });

  useKeyPressEvent("ArrowDown", () => {
    if (currentTaskId) {
      setTasks(moveTaskDown(tasks || [], currentTaskId));
    }
  });

  const currentTask = useMemo(
    () => tasks?.find(({ id }) => currentTaskId === id),
    [tasks, currentTaskId]
  );

  return (
    <div className="App">
      <Button
        variant="contained"
        onClick={() => {
          setCurrentTaskId(undefined);
          setAddModalOpen();
        }}
      >
        Add task
      </Button>

      <div
        style={{ marginTop: 16 }}
        onClick={(e) => {
          e.stopPropagation();
          setCurrentTaskId(undefined);
        }}
      >
        {tasks?.map(({ id, name, effortPoints, worryPoints }) => (
          <div
            key={id}
            style={{
              float: "left",
              marginRight: 16,
              marginBottom: 16,
              width: 160 * Math.sqrt(effortPoints),
              height: 160 * Math.sqrt(effortPoints),
            }}
          >
            <Card
              onClick={(e) => {
                e.stopPropagation();
                setCurrentTaskId(id);
              }}
              style={{
                backgroundColor: getColor(worryPoints),
              }}
              // TODO use css
              className={currentTaskId === id ? "Card Card__active" : "Card"}
            >
              <CardContent>{name}</CardContent>

              <CardActions>
                <CardButton
                  onClick={() => {
                    setCurrentTaskId(id);
                    setAddModalOpen(id);
                  }}
                  startIcon={<Edit />}
                  mini={effortPoints < 3}
                >
                  Edit
                </CardButton>
                <CardButton
                  onClick={() => {
                    setMode("split");
                    setCurrentTaskId(id);
                    setAddModalOpen(id);
                  }}
                  startIcon={<CallSplit />}
                  mini={effortPoints < 3}
                >
                  Split
                </CardButton>
                <CardButton
                  onClick={() => handleRemoveTask(id)}
                  startIcon={<Close />}
                  mini={effortPoints < 3}
                >
                  Close
                </CardButton>
              </CardActions>
            </Card>
          </div>
        ))}
      </div>
      <Dialog
        maxWidth={mode === "split" ? "lg" : undefined}
        open={addModalOpen}
        data-mui-color-scheme="dark"
        onClose={() => setAddModalOpen(false)}
      >
        <AddTask
          mode={mode}
          currentTask={currentTask}
          onClose={handleCloseModal}
          onSplit={handleSplitSubmit}
          onSubmit={handleDefaultSubmit}
        />
      </Dialog>
    </div>
  );
}

export default TaskUi;
