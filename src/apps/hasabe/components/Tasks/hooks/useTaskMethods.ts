import { generateKeyBetween } from 'fractional-indexing';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'react-use';
import { MangoQuery } from 'rxdb';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

import db from '../../../utils/db';
import { useSelect } from '../../../utils/hooks';
import { EditableTask, Task, UpdateMode } from '../../../utils/types';

type UseTasksMethodsProps = {
  filters?: {
    tag: string | null;
    search: string | null;
  };
};

const DEFAULT_QUERY: MangoQuery<Task> = {
  sort: [{ orderIndex: "asc" }],
};

export const useTaskMethods = ({ filters }: UseTasksMethodsProps) => {
  const [currentTaskId, setCurrentTaskId] = useState<string | undefined>();
  const tasksTable = useMemo(async () => (await db).tasks, []);

  const [debouncedSearch, setDebouncedSearch] = useState<string | null>(null);
  useDebounce(
    () => {
      setDebouncedSearch(filters?.search || null);
    },
    500,
    [filters?.search]
  );

  const tasksSelectOptions = useMemo<MangoQuery<Task>>(() => {
    const query = { ...DEFAULT_QUERY };
    if (filters?.tag) {
      query.selector = {
        ...query.selector,
        tags: { $eq: filters.tag },
      };
    }
    if (debouncedSearch) {
      query.selector = {
        ...query.selector,
        name: { $regex: new RegExp(debouncedSearch, "i") },
      };
    }
    return query;
  }, [filters?.tag, debouncedSearch]);

  const tasks = useSelect<Task>(tasksTable, tasksSelectOptions);

  const [mode, setMode] = useState<UpdateMode>("single");
  const [highestOrderIndex, setHighestOrderIndex] = useState<string | null>(
    null
  );
  const [lowestOrderIndex, setLowestOrderIndex] = useState<string | null>(null);

  // Get highest order index on mount
  useEffect(() => {
    (async () => {
      const highestItem = await (await tasksTable)
        .findOne({ sort: [{ orderIndex: "desc" }] })
        .exec();
      setHighestOrderIndex(highestItem?.orderIndex);

      const lowestItem = await (await tasksTable)
        .findOne({ sort: [{ orderIndex: "asc" }] })
        .exec();
      setLowestOrderIndex(lowestItem?.orderIndex);
    })();
  }, [tasks, tasksTable]);

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
  }, [tasks, tasksTable]);

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
    [highestOrderIndex, tasksTable]
  );

  const handleEditTask = useCallback(
    async ({ id, ...task }: Omit<Partial<Task>, "id"> & Pick<Task, "id">) => {
      const oldTask = await (await tasksTable)
        .findOne({ selector: { id } })
        .exec();

      oldTask.patch(task);
    },
    [tasksTable]
  );

  const handleRemoveTask = useCallback(
    async (id: string) => {
      const task = await (await tasksTable)
        .findOne({ selector: { id } })
        .exec();

      task.remove();
    },
    [tasksTable]
  );

  const handleSplitTasks = useCallback(
    async (origTask: Task, newTask: EditableTask) => {
      const finalNewTask = { ...newTask, id: uuidv4() };
      (await tasksTable).insert(finalNewTask);

      handleEditTask(origTask);
    },
    [handleEditTask, tasksTable]
  );

  const handleMoveTaskToTop = useCallback(
    (id: string) => {
      const orderIndex = generateKeyBetween(null, lowestOrderIndex);

      handleEditTask({ id, orderIndex });
    },
    [lowestOrderIndex, handleEditTask]
  );

  const handleMoveTaskToBottom = useCallback(
    (id: string) => {
      const orderIndex = generateKeyBetween(
        null,
        tasks[tasks.length - 1].orderIndex
      );

      handleEditTask({ id, orderIndex });
    },
    [tasks, handleEditTask]
  );

  const handleMoveTask = useCallback(
    (id: string, offset: number) => {
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
    handleMoveTaskToTop,
    handleMoveTaskToBottom,
    handleAddTask,
    setCurrentTaskId,
    handleResetOrder,
    setMode,
  };
};
