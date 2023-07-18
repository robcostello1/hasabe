import { motion } from "framer-motion";
import { ReactNode, useCallback, useState } from "react";

import { CallSplit, Close, Edit } from "@mui/icons-material";
import {
  Card,
  CardActions,
  CardContent,
  ClickAwayListener,
  Menu,
} from "@mui/material";

import { Task } from "../../../utils/types";
import { getColor } from "../../../utils/utils";
import { CardButton } from "../../General";

type TaskListItemProps = {
  task: Task;
  active?: boolean;
  renderContextMenu?: (id: string, handleClose: () => void) => ReactNode;
  onSelect: (id: string) => void;
  onClickEdit: (id: string) => void;
  onClickSplit: (id: string) => void;
  onClickClose: (id: string) => void;
};

const TaskListItem = ({
  task: { id, name, effortPoints, worryPoints },
  active,
  renderContextMenu,
  onSelect,
  onClickEdit,
  onClickSplit,
  onClickClose,
}: TaskListItemProps) => {
  // TODO not working
  // const isInView = useInView(ref);
  const [contextMenuPosition, setContextMenuPosition] = useState<
    { top: number; left: number } | undefined
  >(undefined);
  const handleClose = useCallback(() => {
    setContextMenuPosition(undefined);
  }, []);

  return (
    <>
      {renderContextMenu && (
        <ClickAwayListener onClickAway={handleClose}>
          <Menu
            anchorReference="anchorPosition"
            anchorPosition={contextMenuPosition}
            id="basic-menu"
            open={!!contextMenuPosition}
            onClose={handleClose}
          >
            {renderContextMenu(id, handleClose)}
          </Menu>
        </ClickAwayListener>
      )}

      <motion.div
        layoutId={id}
        className={`ListItem ListItem__${effortPoints}`}
        key={id}
        // transition={{ duration: isInView ? 0.2 : 0 }}
        onContextMenu={(e) => {
          console.log(e);
          e.preventDefault();
          e.stopPropagation();
          setContextMenuPosition({ top: e.clientY, left: e.clientX });
        }}
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
    </>
  );
};

export default TaskListItem;
