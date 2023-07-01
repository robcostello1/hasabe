import "./TaskList.css";

import { useViewportScroll } from "framer-motion";
import { useRef } from "react";

import { Task } from "../../../utils/types";
import TaskListItem from "../TaskListItem/TaskListItem";

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
      {tasks?.map((task) => (
        <TaskListItem
          key={task.id}
          active={currentTaskId === task.id}
          task={task}
          onSelect={onSelectTask}
          onClickEdit={onClickEditTask}
          onClickSplit={onClickSplitTask}
          onClickClose={onClickCloseTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
