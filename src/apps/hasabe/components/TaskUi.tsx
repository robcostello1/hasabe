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

      <TaskList
        tasks={tasks}
        currentTaskId={currentTaskId}
        onSelectTask={setCurrentTaskId}
        onUnselectTask={() => setCurrentTaskId(undefined)}
        onClickEditTask={(id) => {
          setCurrentTaskId(id);
          setAddModalOpen(id);
        }}
        onClickSplitTask={(id) => {
          setMode("split");
          setCurrentTaskId(id);
          setAddModalOpen(id);
        }}
        onClickCloseTask={(id) => handleRemoveTask(id)}
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
