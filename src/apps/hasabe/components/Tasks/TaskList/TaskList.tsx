import './TaskList.css';

import { MouseEvent, ReactNode, useCallback, useRef } from 'react';

import { Task } from '../../../utils/types';
import TaskListItem from '../TaskListItem/TaskListItem';

type TaskListProps = {
  tasks?: Task[];
  currentTaskId?: string;
  renderContextMenu?: (id: string, handleClose: () => void) => ReactNode;
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
  renderContextMenu,
}: TaskListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickBackground = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onUnselectTask();
    },
    [onUnselectTask]
  );

  return (
    <div
      ref={containerRef}
      className={"ListContainer"}
      onClick={handleClickBackground}
    >
      {tasks?.map((task) => (
        <TaskListItem
          key={task.id}
          active={currentTaskId === task.id}
          task={task}
          renderContextMenu={renderContextMenu}
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
