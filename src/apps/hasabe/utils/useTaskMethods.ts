import { EditableTask, Task, UpdateMode } from "./types";
import { useCallback, useContext, useEffect, useState } from "react";
import { useToggle } from "react-use";

// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { DBContext } from "./context";

export const useTaskMethods = () => {
  const [currentTaskId, setCurrentTaskId] = useState<string | undefined>();
  const [addModalOpen, setAddModalOpen] = useToggle(false);
  const [mode, setMode] = useState<UpdateMode>("single");

  const { localDB } = useContext(DBContext);
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = useCallback(async () => {
    // Alt = https://pouchdb.com/api.html#query_index
    const allDocs = await localDB.allDocs({ include_docs: true });
    const docs = allDocs.rows
      .map((row) => row.doc)
      .filter((doc) => doc?.type === "task");

    if (docs !== undefined) {
      // TODO
      setTasks(docs as Task[]);
    }
  }, [localDB]);

  // Init tasks from localDB
  useEffect(() => {
    (async () => {
      fetchTasks();

      // TODO store for cancelation
      localDB
        .changes({
          since: "now",
          live: true,
          include_docs: true,
        })
        .on("change", function (change) {
          if (change.doc?.type === "task") {
            fetchTasks();
          }
        })
        // .on("complete", function (info) {
        //   // changes() was canceled
        // })
        .on("error", function (err) {
          console.log(err);
        });
    })();
  }, []);

  const handleCloseModal = useCallback(() => {
    setCurrentTaskId(undefined);
    setAddModalOpen(false);
    setMode("single");
  }, [setAddModalOpen]);

  const handleAddTask = useCallback(
    (task: EditableTask) => {
      localDB.put({ ...task, _id: uuidv4() });
      handleCloseModal();
    },
    [tasks, handleCloseModal, setTasks]
  );

  const handleEditTask = useCallback(
    (task: Task) => {
      localDB.put(task);
      handleCloseModal();
    },
    [handleCloseModal]
  );

  const handleRemoveTask = useCallback((task: Task) => {
    localDB.remove(
      // TODO
      task as Task & { _rev: string }
    );
  }, []);

  const handleSplitTasks = useCallback(
    (origTask: Task, newTask: EditableTask) => {
      localDB.put(origTask);
      localDB.put({ ...newTask, _id: uuidv4() });
    },
    []
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
        handleEditTask({ ...task, _id: currentTaskId });
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
