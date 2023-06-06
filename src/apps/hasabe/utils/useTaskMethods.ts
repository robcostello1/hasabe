import { useCallback, useEffect, useState } from "react";
import { useToggle } from "react-use";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

import db from "./db";
import { EditableTask, Task, UpdateMode } from "./types";

export const useTaskMethods = () => {
  const [currentTaskId, setCurrentTaskId] = useState<string | undefined>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addModalOpen, setAddModalOpen] = useToggle(false);
  const [mode, setMode] = useState<UpdateMode>("single");

  useEffect(() => {
    (async () => {
      (await db).tasks.find().$.subscribe((tasks) => {
        setTasks(tasks.map((task) => task.toJSON()));
      });
    })();
  }, []);

  const handleCloseModal = useCallback(() => {
    setCurrentTaskId(undefined);
    setAddModalOpen(false);
    setMode("single");
  }, [setAddModalOpen]);

  const handleAddTask = useCallback(
    async (task: EditableTask) => {
      const newTask = { ...task, id: uuidv4() };
      (await db).tasks.insert(newTask);
      handleCloseModal();
    },
    [handleCloseModal]
  );

  const handleEditTask = useCallback(
    async ({ id, ...task }: Task) => {
      const oldTask = await (await db).tasks
        .findOne({ selector: { id } })
        .exec();

      oldTask.patch(task);

      handleCloseModal();
    },
    [handleCloseModal]
  );

  const handleRemoveTask = useCallback(async (id: string) => {
    const task = await (await db).tasks.findOne({ selector: { id } }).exec();

    task.remove();
  }, []);

  const handleSplitTasks = useCallback(
    async ({ id: origId, ...origTask }: Task, newTask: EditableTask) => {
      const finalNewTask = { ...newTask, id: uuidv4() };
      (await db).tasks.insert(finalNewTask);

      const oldTask = await (await db).tasks
        .findOne({ selector: { id: origId } })
        .exec();

      oldTask.patch(origTask);
    },
    [currentTaskId, handleEditTask]
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
