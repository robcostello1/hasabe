import { generateKeyBetween } from "fractional-indexing";
import { useCallback, useEffect, useState } from "react";
import { useToggle } from "react-use";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

import db from "./db";
import { EditableTask, Task, UpdateMode } from "./types";

export const useTaskMethods = () => {
  const [currentTaskId, setCurrentTaskId] = useState<string | undefined>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mode, setMode] = useState<UpdateMode>("single");
  const [highestOrderIndex, setHighestOrderIndex] = useState<string | null>(
    null
  );

  useEffect(() => {
    console.log(highestOrderIndex);
  }, [highestOrderIndex]);

  // Get highest order index on mount
  useEffect(() => {
    (async () => {
      const highestItem = await (await db).tasks
        .findOne({ sort: [{ orderIndex: "desc" }] })
        .exec();
      setHighestOrderIndex(highestItem?.orderIndex);
    })();
  }, [tasks]);

  useEffect(() => {
    (async () => {
      (await db).tasks
        .find({ sort: [{ orderIndex: "asc" }] })
        .$.subscribe((tasks) => {
          setTasks(tasks.map((task) => task.toJSON()));
        });
    })();
  }, []);

  const handleResetOrder = useCallback(async () => {
    let orderIndex: string | null = null;
    const newTaskOrder = tasks.map(({ id }) => {
      orderIndex = generateKeyBetween(orderIndex, null);
      return { orderIndex, id };
    });

    newTaskOrder.forEach(async ({ orderIndex, id }) => {
      const taskToEdit = await (await db).tasks
        .findOne({ selector: { id } })
        .exec();

      taskToEdit.patch({ orderIndex });
    });
  }, [tasks]);

  const handleAddTask = useCallback(
    async (task: EditableTask) => {
      setCurrentTaskId(undefined);

      const orderIndex = generateKeyBetween(highestOrderIndex, null);

      const newTask = {
        ...task,
        orderIndex,
        id: uuidv4(),
      };
      (await db).tasks.insert(newTask);
    },
    [highestOrderIndex]
  );

  const handleEditTask = useCallback(
    async ({ id, ...task }: Omit<Partial<Task>, "id"> & Pick<Task, "id">) => {
      const oldTask = await (await db).tasks
        .findOne({ selector: { id } })
        .exec();

      oldTask.patch(task);
    },
    []
  );

  const handleRemoveTask = useCallback(async (id: string) => {
    const task = await (await db).tasks.findOne({ selector: { id } }).exec();

    task.remove();
  }, []);

  const handleSplitTasks = useCallback(
    async (origTask: Task, newTask: EditableTask) => {
      const finalNewTask = { ...newTask, id: uuidv4() };
      (await db).tasks.insert(finalNewTask);

      handleEditTask(origTask);
    },
    [currentTaskId, handleEditTask]
  );

  const handleMoveTask = useCallback(
    async (id: string, offset: number) => {
      const currentIndex = tasks.indexOf(tasks.find((task) => task.id === id)!);
      if (
        currentIndex + offset < 0 ||
        currentIndex + offset > tasks.length - 1
      ) {
        return;
      }

      const targetIndexLeft = currentIndex + (offset < 0 ? offset - 1 : offset);
      const targetIndexRight = targetIndexLeft + 1;
      const orderIndex = generateKeyBetween(
        tasks[targetIndexLeft]?.orderIndex,
        tasks[targetIndexRight]?.orderIndex
      );
      handleEditTask({ id, orderIndex });
    },
    [tasks]
  );

  return {
    currentTaskId,
    mode,
    tasks,
    highestOrderIndex,
    handleRemoveTask,
    handleEditTask,
    handleSplitTasks,
    handleMoveTask,
    handleAddTask,
    setCurrentTaskId,
    handleResetOrder,
    setMode,
  };
};
