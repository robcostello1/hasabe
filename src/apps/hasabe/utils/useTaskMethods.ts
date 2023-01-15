import { EditableTask, Task, UpdateMode } from "./types";
import { useCallback, useState } from "react";
import { useLocalStorage, useToggle } from "react-use";

import { removeTask } from "./utils";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

export const useTaskMethods = () => {
  const [currentTaskId, setCurrentTaskId] = useState<string | undefined>();
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [addModalOpen, setAddModalOpen] = useToggle(false);
  const [mode, setMode] = useState<UpdateMode>("single");

  /**
   * As we use an array structure for tasks, we have to map through the array to find and edit
   * the relevant task. Closure that returns a map function.
   */
  const iterateEdits = useCallback(
    (updatedTask: Task) => (task: Task) =>
      updatedTask.id !== currentTaskId
        ? updatedTask
        : { ...task, ...updatedTask },
    [currentTaskId]
  );

  const handleCloseModal = useCallback(() => {
    setCurrentTaskId(undefined);
    setAddModalOpen(false);
    setMode("single");
  }, [setAddModalOpen]);

  const handleAddTask = useCallback(
    (task: EditableTask) => {
      const newTask = { ...task, id: uuidv4() };
      setTasks([...(tasks || []), newTask]);
      handleCloseModal();
    },
    [tasks, handleCloseModal, setTasks]
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
    },
    [tasks, setTasks]
  );

  const handleSplitTasks = useCallback(
    (origTask: Task, newTask: EditableTask) => {
      const finalNewTask = { ...newTask, id: uuidv4() };
      setTasks([...(tasks || []).map(iterateEdits(origTask)), finalNewTask]);
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
