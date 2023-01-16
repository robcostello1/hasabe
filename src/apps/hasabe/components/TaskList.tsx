import { Edit, CallSplit, Close } from "@mui/icons-material";
import { Card, CardContent, CardActions } from "@mui/material";
import { Task } from "../utils/types";
import { getColor } from "../utils/utils";
import CardButton from "./CardButton";

type TaskListProps = {
  tasks?: Task[];
  currentTaskId?: string;
  onSelectTask: (id: string) => void;
  onUnselectTask: () => void;
  onClickEditTask: (id: string) => void;
  onClickSplitTask: (id: string) => void;
  onClickCloseTask: (id: string) => void;
};

const TaskList = ({
  tasks,
  currentTaskId,
  onSelectTask,
  onUnselectTask,
  onClickEditTask,
  onClickSplitTask,
  onClickCloseTask,
}: TaskListProps) => (
  <div
    // TODO
    style={{ marginTop: 16 }}
    onClick={(e) => {
      e.stopPropagation();
      onUnselectTask();
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
            onSelectTask(id);
          }}
          style={{
            backgroundColor: getColor(worryPoints),
          }}
          className={currentTaskId === id ? "Card Card__active" : "Card"}
        >
          <CardContent>{name}</CardContent>

          <CardActions>
            <CardButton
              onClick={() => onClickEditTask(id)}
              startIcon={<Edit />}
              mini={effortPoints < 3}
            >
              Edit
            </CardButton>
            <CardButton
              onClick={() => onClickSplitTask(id)}
              startIcon={<CallSplit />}
              mini={effortPoints < 3}
            >
              Split
            </CardButton>
            <CardButton
              onClick={() => onClickCloseTask(id)}
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
);

export default TaskList;
