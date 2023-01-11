import { Button, Card, CardActions, CardContent, Dialog } from "@mui/material";
import { useKeyPressEvent } from "react-use";
// @ts-ignore
import AddTask from "./AddTask";
import "./TaskUi.css";
import PouchDB from "pouchdb";

import { CallSplit, Close, Edit } from "@mui/icons-material";
import CardButton from "./CardButton";
import { useTaskMethods } from "./utils/useTaskMethods";
import { getColor, moveTaskDown, moveTaskUp } from "./utils/utils";
import { DatabaseEnums } from "./utils/enums/database.enums";
import useTaskRecords from "./utils/useTaskRecords";
import { useCallback, useState } from "react";
import { Task } from "./utils/types";
interface Props {
  databaseInstance: any;
  metadataInfo: {
    nodeId: string;
    eventCount: number;
    _rev: string;
  };
}

// TODO "sprint" UI
// Undo
// TODO groups
// TODO multi-item selection
function TaskUi({ databaseInstance, metadataInfo }: Props) {
  const metadataDatabaseInstance = new PouchDB(DatabaseEnums.MetadataDBName);

  const dbTasks: any = useTaskRecords(databaseInstance);
  const [eventCount, setEventCount] = useState(metadataInfo.eventCount);

  const storeEventCount = (num: number) => {
    setEventCount(num);
    metadataDatabaseInstance.put({
      _id: DatabaseEnums.MetadataDBLookupRow,
      _rev: metadataInfo._rev,
      eventCount: num,
      nodeId: metadataInfo.nodeId,
    });
  };

  const onAdd = useCallback((task: Task) => {
    const newCount = eventCount + 1;
    const document = {
      _id: task.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...task,
    };
    databaseInstance.put(document);
    storeEventCount(newCount);
  }, []);

  const onEdit = useCallback((task: Task) => {}, []);

  const onRemove = useCallback(async (id: string) => {
    let doc;
    try {
      doc = await databaseInstance.get(id);
    } catch (err) {
      console.error(err, "props.databaseInstance.get error");
      return;
    }
    databaseInstance.remove(id, doc._rev);
  }, []);

  const {
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
  } = useTaskMethods({
    onAdd,
    onEdit,
    onRemove,
  });

  useKeyPressEvent("ArrowUp", () => {
    if (currentTaskId) {
      setTasks(moveTaskUp(tasks || [], currentTaskId));
    }
  });

  useKeyPressEvent("ArrowDown", () => {
    if (currentTaskId) {
      setTasks(moveTaskDown(tasks || [], currentTaskId));
    }
  });

  return (
    <div className="App">
      <Button
        variant="contained"
        onClick={() => {
          setCurrentTaskId(undefined);
          setAddModalOpen();
        }}
      >
        Add task
      </Button>

      <div
        style={{ marginTop: 16 }}
        onClick={(e) => {
          e.stopPropagation();
          setCurrentTaskId(undefined);
        }}
      >
        {tasks?.map(({ id, name, effortPoints, worryPoints }) => (
          <div
            key={id}
            style={{
              float: "left",
              marginRight: 16,
              marginBottom: 16,
              width: 160 * Math.sqrt(effortPoints),
              height: 160 * Math.sqrt(effortPoints),
            }}
          >
            <Card
              onClick={(e) => {
                e.stopPropagation();
                setCurrentTaskId(id);
              }}
              style={{
                backgroundColor: getColor(worryPoints),
              }}
              className={currentTaskId === id ? "Card Card__active" : "Card"}
            >
              <CardContent>{name}</CardContent>

              <CardActions>
                <CardButton
                  onClick={() => {
                    setCurrentTaskId(id);
                    setAddModalOpen(id);
                  }}
                  startIcon={<Edit />}
                  mini={effortPoints < 3}
                >
                  Edit
                </CardButton>
                <CardButton
                  onClick={() => {
                    setMode("split");
                    setCurrentTaskId(id);
                    setAddModalOpen(id);
                  }}
                  startIcon={<CallSplit />}
                  mini={effortPoints < 3}
                >
                  Split
                </CardButton>
                <CardButton
                  onClick={() => handleRemoveTask(id)}
                  startIcon={<Close />}
                  mini={effortPoints < 3}
                >
                  Close
                </CardButton>
              </CardActions>
            </Card>
          </div>
        ))}
      </div>
      <Dialog
        maxWidth={mode === "split" ? "lg" : undefined}
        open={addModalOpen}
        data-mui-color-scheme="dark"
        onClose={() => setAddModalOpen(false)}
      >
        <AddTask
          mode={mode}
          currentTask={tasks?.find(({ id }) => currentTaskId === id)}
          onClose={handleCloseModal}
          onSplit={handleSplitSubmit}
          onSubmit={handleDefaultSubmit}
        />
      </Dialog>
    </div>
  );
}

export default TaskUi;
