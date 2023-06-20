import { generateKeyBetween } from "fractional-indexing";
import { useCallback, useEffect, useMemo, useState } from "react";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

import db from "../../../utils/db";
import { useSelect } from "../../../utils/hooks";
import { EditableTask, Task, UpdateMode } from "../../../utils/types";

type UseTasksMethodsProps = {
  filters?: {
    tag?: string;
  };
};

export const useTaskMethods = ({ filters }: UseTasksMethodsProps) => {
  const [currentTaskId, setCurrentTaskId] = useState<string | undefined>();
  const tasksTable = useMemo(async () => (await db).tasks, []);

  const tasks = useSelect<Task>(tasksTable, {
    sort: [{ orderIndex: "asc" }],
    // TODO expand this to support multiple tags and other filters
    selector: filters?.tag
      ? {
          tags: { $eq: filters.tag },
        }
      : undefined,
  });
  const [mode, setMode] = useState<UpdateMode>("single");
  const [highestOrderIndex, setHighestOrderIndex] = useState<string | null>(
    null
  );

  // Get highest order index on mount
  useEffect(() => {
    (async () => {
      const highestItem = await (await tasksTable)
        .findOne({ sort: [{ orderIndex: "desc" }] })
        .exec();
      setHighestOrderIndex(highestItem?.orderIndex);
    })();
  }, [tasks]);

  const handleResetOrder = useCallback(async () => {
    let orderIndex: string | null = null;
    const newTaskOrder = tasks.map(({ id }) => {
      orderIndex = generateKeyBetween(orderIndex, null);
      return { orderIndex, id };
    });

    newTaskOrder.forEach(async ({ orderIndex, id }) => {
      const taskToEdit = await (await tasksTable)
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
      (await tasksTable).insert(newTask);
    },
    [highestOrderIndex]
  );

  const handleEditTask = useCallback(
    async ({ id, ...task }: Omit<Partial<Task>, "id"> & Pick<Task, "id">) => {
      const oldTask = await (await tasksTable)
        .findOne({ selector: { id } })
        .exec();

      oldTask.patch(task);
    },
    []
  );

  const handleRemoveTask = useCallback(async (id: string) => {
    const task = await (await tasksTable).findOne({ selector: { id } }).exec();

    task.remove();
  }, []);

  const handleSplitTasks = useCallback(
    async (origTask: Task, newTask: EditableTask) => {
      const finalNewTask = { ...newTask, id: uuidv4() };
      (await tasksTable).insert(finalNewTask);

      handleEditTask(origTask);
    },
    [handleEditTask]
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
    [tasks, handleEditTask]
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
