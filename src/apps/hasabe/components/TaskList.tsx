import "./TaskList.css";

import { motion } from "framer-motion";
import { useRef } from "react";

import { CallSplit, Close, Edit } from "@mui/icons-material";
import { Card, CardActions, CardContent } from "@mui/material";

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
}: TaskListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={"ListContainer"}
      onClick={(e) => {
        e.stopPropagation();
        onUnselectTask();
      }}
    >
      {tasks?.map(({ id, name, effortPoints, worryPoints }) => (
        <motion.div
          layoutId={id}
          className={`ListItem ListItem__${effortPoints}`}
          key={id}
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
            <CardContent className="TaskName">{name}</CardContent>

            <CardActions className="TaskActions">
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
        </motion.div>
      ))}
    </div>
  );
};

export default TaskList;
