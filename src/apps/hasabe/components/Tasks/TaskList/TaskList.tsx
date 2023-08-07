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

  // const locations = useRef<{ x: number; y: number }[]>([]);
  // useEffect(() => {
  //   setTimeout(() => {
  //     containerRef.current?.childNodes.forEach((node, index) => {
  //       locations.current[index] = {
  //         x: (node as HTMLDivElement).clientLeft,
  //         y: (node as HTMLDivElement).clientTop,
  //       };
  //     });
  //   }, TRANSITION_DURATION + 1);
  // }, [tasks]);

  // const [draggedItemLocation, setDraggedItemLocation] = useState<{
  //   id: string;
  //   x: number;
  //   y: number;
  //   index: number;
  // } | null>(null);
  // useDebounce(
  //   () => {
  //     console.log(draggedItemLocation);
  //   },
  //   1000,
  //   [draggedItemLocation]
  // );

  return (
    <div
      ref={containerRef}
      className={"ListContainer"}
      onClick={handleClickBackground}
    >
      {tasks?.map(
        (
          task
          // index
        ) => (
          <TaskListItem
            key={task.id}
            active={currentTaskId === task.id}
            task={task}
            // index={index}
            // onDrag={setDraggedItemLocation}
            renderContextMenu={renderContextMenu}
            onSelect={onSelectTask}
            onClickEdit={onClickEditTask}
            onClickSplit={onClickSplitTask}
            onClickClose={onClickCloseTask}
          />
        )
      )}
    </div>
  );
};

export default TaskList;
