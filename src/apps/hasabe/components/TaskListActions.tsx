import "./TaskListActions.css";

import { Button } from "@mui/material";

import { EditableTask } from "../utils/types";

type TaskListActionsProps = {
  handleOpenModal: () => void;
  handleResetOrder: () => void;
  handleAddTask: (task: EditableTask) => void;
  debug?: boolean;
};

const TaskListActions = ({
  handleOpenModal,
  handleResetOrder,
  handleAddTask,
  debug,
}: TaskListActionsProps) => (
  <div className="TaskListActions">
    <Button variant="contained" onClick={handleOpenModal}>
      Add task
    </Button>
    {debug && (
      <>
        <Button variant="outlined" onClick={handleResetOrder}>
          Reset order
        </Button>
        <Button
          variant="outlined"
          onClick={() =>
            handleAddTask({
              name: Math.round(Math.random() * 100000).toString(),
              effortPoints: [1, 2, 3, 5, 8, 13, 21][
                Math.floor(Math.random() * 7)
              ],
              worryPoints: [1, 2, 3, 5, 8, 13, 21][
                Math.floor(Math.random() * 7)
              ],
              body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue. Nullam id dolor id nibh ultricies vehicula ut id elit.",
            })
          }
        >
          Add random task
        </Button>
      </>
    )}
  </div>
);

export default TaskListActions;