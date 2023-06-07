import "./TaskUi.css";

import { useCallback, useMemo } from "react";
import { useKeyPressEvent, useToggle } from "react-use";

import { Button, Dialog } from "@mui/material";

import { EditableTask, Task } from "../utils/types";
import { useTaskMethods } from "../utils/useTaskMethods";
import AddTask from "./AddTask";
import TaskList from "./TaskList";

function TaskUi({ debug }: { debug?: boolean }) {
  const [addModalOpen, setAddModalOpen] = useToggle(false);

  const {
    currentTaskId,
    mode,
    tasks,
    handleRemoveTask,
    handleAddTask,
    handleEditTask,
    handleSplitTasks,
    handleMoveTask,
    handleResetOrder,
    setCurrentTaskId,
    setMode,
  } = useTaskMethods();

  const handleOpenModal = useCallback(() => {
    setCurrentTaskId(undefined);
    setAddModalOpen(true);
  }, [setAddModalOpen, setCurrentTaskId]);

  const handleCloseModal = useCallback(() => {
    setCurrentTaskId(undefined);
    setAddModalOpen(false);
    setMode("single");
  }, [setAddModalOpen, setCurrentTaskId, setMode]);

  const handleSplitSubmit = useCallback(
    (origTask: EditableTask, newTask: EditableTask) => {
      handleSplitTasks(origTask as Task, newTask);

      handleCloseModal();
    },
    [handleSplitTasks, handleCloseModal]
  );

  const handleDefaultSubmit = useCallback(
    (task: EditableTask) => {
      if (!currentTaskId) {
        handleAddTask(task);
      } else {
        handleEditTask({
          ...task,
          id: currentTaskId,
        });
      }

      handleCloseModal();
    },
    [handleAddTask, handleEditTask, currentTaskId, handleCloseModal]
  );

  useKeyPressEvent("ArrowUp", () => {
    if (currentTaskId) {
      handleMoveTask(currentTaskId, -1);
    }
  });

  useKeyPressEvent("ArrowDown", () => {
    if (currentTaskId) {
      handleMoveTask(currentTaskId, 1);
    }
  });

  const currentTask = useMemo(
    () => tasks?.find(({ id }) => currentTaskId === id),
    [tasks, currentTaskId]
  );

  return (
    <div className="App">
      <Button variant="contained" onClick={handleOpenModal}>
        Add task
      </Button>
      {debug && (
        <>
          <Button variant="outlined" onClick={handleResetOrder}>
            Reset order
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              handleAddTask({
                name: Math.round(Math.random() * 100000).toString(),
                effortPoints: [1, 2, 3, 5, 8, 13, 21][
                  Math.floor(Math.random() * 7)
                ],
                worryPoints: [1, 2, 3, 5, 8, 13, 21][
                  Math.floor(Math.random() * 7)
                ],
                body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue. Nullam id dolor id nibh ultricies vehicula ut id elit.",
              })
            }
          >
            Add random task
          </Button>
        </>
      )}

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
