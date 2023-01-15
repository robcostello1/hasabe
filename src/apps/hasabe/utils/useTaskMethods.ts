import { EditableTask, Task, UpdateMode } from "./types";
import { useCallback, useState } from "react";
import { useLocalStorage, useToggle } from "react-use";

import { removeTask } from "./utils";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

export type UseTaskMethodProps = {
  onAdd?: (task: Task) => void;
  onRemove?: (id: string) => void;
  onEdit?: (task: Task) => void;
};

export const useTaskMethods = ({
  onAdd,
  onRemove,
  onEdit,
}: UseTaskMethodProps) => {
  const [currentTaskId, setCurrentTaskId] = useState<string | undefined>();
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [addModalOpen, setAddModalOpen] = useToggle(false);
  const [mode, setMode] = useState<UpdateMode>("single");

  const handleCloseModal = useCallback(() => {
    setCurrentTaskId(undefined);
    setAddModalOpen(false);
    setMode("single");
  }, [setAddModalOpen]);

  const handleAddTask = useCallback(
    (task: EditableTask) => {
      const newTask = { ...task, id: uuidv4() };
      setTasks([...(tasks || []), newTask]);
      onAdd?.(newTask);
      handleCloseModal();
    },
    [tasks, handleCloseModal, setTasks]
  );

  const iterateEdits = useCallback(
    (task: Task) => (updatedTask: Task) => {
      const editedTask = { ...updatedTask, ...task };
      if (updatedTask.id !== currentTaskId) {
        return updatedTask;
      }
      // TODO sideeffect
      onEdit?.(editedTask);
      return editedTask;
    },
    [onEdit, currentTaskId]
  );

  const handleEditTask = useCallback(
    (task: Task) => {
      setTasks(tasks?.map(iterateEdits(task)));
      handleCloseModal();
    },
    [setTasks, currentTaskId, tasks, handleCloseModal, iterateEdits]
  );

  const handleRemoveTask = useCallback(
    (id: string) => {
      setTasks(removeTask(id, tasks));
      onRemove?.(id);
    },
    [tasks, setTasks]
  );

  const handleSplitTasks = useCallback(
    (origTask: Task, newTask: EditableTask) => {
      const finalNewTask = { ...newTask, id: uuidv4() };
      setTasks([...(tasks || []).map(iterateEdits(origTask)), finalNewTask]);
      onAdd?.(finalNewTask);
    },
    [tasks, currentTaskId, setTasks, iterateEdits]
  );

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
        handleEditTask({ ...task, id: currentTaskId });
      }
    },
    [handleAddTask, handleEditTask, currentTaskId]
  );

  return {
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
  };
};
