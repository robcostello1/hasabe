import { motion } from "framer-motion";

import { CallSplit, Close, Edit } from "@mui/icons-material";
import { Card, CardActions, CardContent } from "@mui/material";

import { Task } from "../../../utils/types";
import { getColor } from "../../../utils/utils";
import { CardButton } from "../../General";

type TaskListItemProps = {
  task: Task;
  active?: boolean;
  onSelect: (id: string) => void;
  onClickEdit: (id: string) => void;
  onClickSplit: (id: string) => void;
  onClickClose: (id: string) => void;
};

const TaskListItem = ({
  task: { id, name, effortPoints, worryPoints },
  active,
  onSelect,
  onClickEdit,
  onClickSplit,
  onClickClose,
}: TaskListItemProps) => {
  // TODO not working
  //   const ref = useRef(null);
  //   const isInView = useInView(ref);

  return (
    <motion.div
      layoutId={id}
      className={`ListItem ListItem__${effortPoints}`}
      key={id}
      //   ref={ref}
      //   transition={{ duration: isInView ? 0.2 : 0 }}
    >
      <Card
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
        style={{
          backgroundColor: getColor(worryPoints),
        }}
        className={active ? "Card Card__active" : "Card"}
      >
        <CardContent className="TaskName">{name}</CardContent>

        <CardActions className="TaskActions">
          <CardButton
            onClick={() => onClickEdit(id)}
            startIcon={<Edit />}
            mini={effortPoints < 3}
          >
            <span className="TaskActionLabel">Edit</span>
          </CardButton>
          <CardButton
            onClick={() => onClickSplit(id)}
            startIcon={<CallSplit />}
            mini={effortPoints < 3}
          >
            <span className="TaskActionLabel">Split</span>
          </CardButton>
          <CardButton
            onClick={() => onClickClose(id)}
            startIcon={<Close />}
            mini={effortPoints < 3}
          >
            <span className="TaskActionLabel">Close</span>
          </CardButton>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default TaskListItem;
