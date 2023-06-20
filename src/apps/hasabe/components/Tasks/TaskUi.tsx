import "./TaskUi.css";

import { useCallback, useMemo, useState } from "react";
import { useKeyPressEvent, useToggle } from "react-use";

import { Dialog } from "@mui/material";

import { EditableTask, Tag, Task } from "../../utils/types";
import { TagList } from "../Tags";
import { useTagMethods } from "../Tags/hooks";
import AddTask from "./AddTask";
import { useTaskMethods } from "./hooks";
import TaskList from "./TaskList";
import TaskListActions from "./TaskListActions";

function TaskUi({ debug }: { debug?: boolean }) {
  const [addModalOpen, setAddModalOpen] = useToggle(false);
  const [tag, setTag] = useState<string | null>(null);
  const taskFilters = useMemo(() => ({ tag: tag || undefined }), [tag]);

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
  } = useTaskMethods({ filters: taskFilters });

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

  useKeyPressEvent("ArrowUp", (event) => {
    if (currentTaskId && !addModalOpen) {
      event.preventDefault();
      handleMoveTask(currentTaskId, -1);
    }
  });

  useKeyPressEvent("ArrowDown", (event) => {
    if (currentTaskId && !addModalOpen) {
      event.preventDefault();
      handleMoveTask(currentTaskId, 1);
    }
  });

  const handleTagClick = useCallback((tag: Tag | null) => {
    setTag(tag?.id || null);
  }, []);

  const currentTask = useMemo(
    () => tasks?.find(({ id }) => currentTaskId === id),
    [tasks, currentTaskId]
  );

  const { tags } = useTagMethods();

  const activeTags = useMemo(() => [tag], [tag]);

  return (
    <div className="App">
      <TaskListActions
        handleOpenModal={handleOpenModal}
        handleResetOrder={handleResetOrder}
        handleAddTask={handleAddTask}
        debug={debug}
      />

      <TagList onTagClick={handleTagClick} active={activeTags} tags={tags} />

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
          tags={tags}
          onClose={handleCloseModal}
          onSplit={handleSplitSubmit}
          onSubmit={handleDefaultSubmit}
        />
      </Dialog>
    </div>
  );
}

export default TaskUi;
