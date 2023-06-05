import { useMemo } from "react";
import { useKeyPressEvent } from "react-use";
import { Button, Dialog } from "@mui/material";

import { moveTaskDown, moveTaskUp } from "../utils/utils";
import { useTaskMethods } from "../utils/useTaskMethods";
import AddTask from "./AddTask";
import TaskList from "./TaskList";

import "./TaskUi.css";

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
    () => tasks?.find(({ _id }) => currentTaskId === _id),
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

      <TaskList
        tasks={tasks}
        currentTaskId={currentTaskId}
        onSelectTask={setCurrentTaskId}
        onUnselectTask={() => setCurrentTaskId(undefined)}
        onClickEditTask={(_id) => {
          setCurrentTaskId(_id);
          setAddModalOpen(_id);
        }}
        onClickSplitTask={(_id) => {
          setMode("split");
          setCurrentTaskId(_id);
          setAddModalOpen(_id);
        }}
        onClickCloseTask={(_id) => {
          const taskToRemove = tasks.find((task) => task._id === _id);
          if (taskToRemove) {
            handleRemoveTask(taskToRemove);
          }
        }}
      />

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
