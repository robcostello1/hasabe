import { ContextMenuItem } from "components";
import { useCallback, useMemo, useState } from "react";
import { useKeyPressEvent, useToggle } from "react-use";

import { Dialog } from "@mui/material";

import { EditableTask, Tag, Task } from "../../../utils/types";
import { useTagMethods } from "../../Tags/hooks";
import AddTask from "../AddTask";
import { useTaskMethods } from "../hooks";
import TaskFilters from "../TaskFilters/TaskFilters";
import TaskList from "../TaskList";
import TaskListActions from "../TaskListActions";

function TaskUi({ debug }: { debug?: boolean }) {
  const [addModalOpen, setAddModalOpen] = useToggle(false);
  const [tag, setTag] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  // TODO causes flashes
  const taskProps = useMemo(
    () => ({ filters: { tag, search } }),
    [tag, search]
  );

  const {
    currentTaskId,
    mode,
    tasks,
    handleRemoveTask,
    handleAddTask,
    handleEditTask,
    handleSplitTasks,
    handleMoveTask,
    handleMoveTaskToTop,
    handleMoveTaskToBottom,
    handleResetOrder,
    setCurrentTaskId,
    setMode,
  } = useTaskMethods(taskProps);

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

  const handleTagChange = useCallback((tag: Tag | null) => {
    setTag(tag?.id || null);
  }, []);

  const currentTask = useMemo(
    () => tasks?.find(({ id }) => currentTaskId === id),
    [tasks, currentTaskId]
  );

  const { tags } = useTagMethods();

  // TODO multiple tags
  const activeTags = useMemo(() => [tag], [tag]);

  const handleUnselectTask = useCallback(() => {
    setCurrentTaskId(undefined);
  }, [setCurrentTaskId]);

  const handleClickedEditTask = useCallback(
    (id: string) => {
      setCurrentTaskId(id);
      setAddModalOpen(id);
    },
    [setCurrentTaskId, setAddModalOpen]
  );

  const handleSplitTask = useCallback(
    (id: string) => {
      setMode("split");
      setCurrentTaskId(id);
      setAddModalOpen(id);
    },
    [setCurrentTaskId, setAddModalOpen, setMode]
  );

  const handleRenderContextMenu = useCallback(
    (id: string, handleClose: () => void) => [
      <ContextMenuItem
        key="move-up"
        onClick={() => {
          handleMoveTask(id, -1);
        }}
        shortcut={["up"]}
      >
        Move up
      </ContextMenuItem>,
      <ContextMenuItem
        key="move-down"
        onClick={() => {
          handleMoveTask(id, 1);
        }}
        shortcut={["down"]}
      >
        Move down
      </ContextMenuItem>,
      <ContextMenuItem
        key="move-top"
        onClick={() => {
          handleMoveTaskToTop(id);
          handleClose();
        }}
      >
        Move to top
      </ContextMenuItem>,
      <ContextMenuItem
        key="move-bottom"
        onClick={() => {
          handleMoveTaskToBottom(id);
          handleClose();
        }}
      >
        Move to bottom
      </ContextMenuItem>,
    ],
    [handleMoveTaskToBottom, handleMoveTaskToTop, handleMoveTask]
  );

  const handleCloseAddTaskModal = useCallback(
    () => setAddModalOpen(false),
    [setAddModalOpen]
  );

  return (
    <div className="App">
      <TaskListActions
        handleOpenModal={handleOpenModal}
        handleResetOrder={handleResetOrder}
        handleAddTask={handleAddTask}
        debug={debug}
      />

      <TaskFilters
        availableTags={tags}
        activeTags={activeTags}
        setSearch={setSearch}
        onTagChange={handleTagChange}
      />

      <TaskList
        tasks={tasks}
        currentTaskId={currentTaskId}
        onSelectTask={setCurrentTaskId}
        onUnselectTask={handleUnselectTask}
        onClickEditTask={handleClickedEditTask}
        onClickSplitTask={handleSplitTask}
        onClickCloseTask={handleRemoveTask}
        renderContextMenu={handleRenderContextMenu}
      />

      <Dialog
        maxWidth={mode === "split" ? "lg" : undefined}
        open={addModalOpen}
        data-mui-color-scheme="dark"
        onClose={handleCloseAddTaskModal}
      >
        <AddTask
          mode={mode}
          currentTask={currentTask}
          availableTags={tags}
          onClose={handleCloseModal}
          onSplit={handleSplitSubmit}
          onSubmit={handleDefaultSubmit}
        />
      </Dialog>
    </div>
  );
}

export default TaskUi;
