import "./TaskListItem.css";

import classNames from "classnames";
import { motion } from "framer-motion";
import {
  forwardRef,
  memo,
  MouseEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useWindowSize } from "react-use";

import { CallSplit, Close, Edit } from "@mui/icons-material";
import {
  Card,
  CardActions,
  CardContent,
  ClickAwayListener,
  Menu,
} from "@mui/material";

import { TRANSITION_DURATION } from "../../../utils/consts";
import { Task } from "../../../utils/types";
import { getColor } from "../../../utils/utils";
import { CardButton } from "../../General";

type TaskListItemProps = {
  task: Task;
  active?: boolean;
  // index: number;
  renderContextMenu?: (id: string, handleClose: () => void) => ReactNode;
  onSelect: (id: string) => void;
  // onDrag?: (props: { id: string; x: number; y: number; index: number }) => void;
  onClickEdit: (id: string) => void;
  onClickSplit: (id: string) => void;
  onClickClose: (id: string) => void;
};

const TaskListItem = forwardRef<HTMLDivElement, TaskListItemProps>(
  (
    {
      task: { id, name, effortPoints, worryPoints },
      active,
      // index,
      renderContextMenu,
      onSelect,
      onClickEdit,
      onClickSplit,
      onClickClose,
      // onDrag,
    },
    ref
  ) => {
    // const isInView = useInView(ref);
    const [contextMenuPosition, setContextMenuPosition] = useState<
      { top: number; left: number } | undefined
    >(undefined);
    const handleClose = useCallback(() => {
      setContextMenuPosition(undefined);
    }, []);

    const { width } = useWindowSize();

    const mini = useMemo(() => {
      switch (effortPoints) {
        case 21:
        case 13:
          return false;

        case 8:
          return width < 410;

        case 5:
          return width < 500;

        case 3:
          return width < 1800;
      }
      return true;
    }, [effortPoints, width]);

    const handleContextMenu = useCallback((e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenuPosition({ top: e.clientY, left: e.clientX });
    }, []);

    const handleCardClick = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onSelect(id);
      },
      [onSelect, id]
    );

    const cardStyle = useMemo(
      () => ({
        backgroundColor: getColor(worryPoints),
      }),
      [worryPoints]
    );

    const handleClickEdit = useCallback(
      () => onClickEdit(id),
      [onClickEdit, id]
    );
    const handleClickSplit = useCallback(
      () => onClickSplit(id),
      [onClickSplit, id]
    );
    const handleClickClose = useCallback(
      () => onClickClose(id),
      [onClickClose, id]
    );
    // const handleDrag = useCallback(
    //   ({ clientX, clientY }: { clientX: number; clientY: number }) =>
    //     onDrag?.({ x: clientX, y: clientY, id, index }),
    //   [onDrag, id, index]
    // );
    // const handleDragStart = useCallback(() => onSelect(id), [onSelect, id]);

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
          ref={ref}
          layoutId={id}
          className={classNames(
            "ListItem",
            `ListItem__${effortPoints}`,
            active && " ListItem__active"
          )}
          key={id}
          onContextMenu={handleContextMenu}
          // drag
          // onDragStart={handleDragStart}
          // // @ts-expect-error
          // onDrag={handleDrag}
          // transition={{ duration: isInView ? TRANSITION_DURATION / 1000 : 0 }}
          transition={{ duration: TRANSITION_DURATION / 1000 }}
        >
          <Card
            onClick={handleCardClick}
            style={cardStyle}
            className={classNames("Card", active && "Card Card__active")}
          >
            <CardContent className="TaskName">{name}</CardContent>

            <CardActions className="TaskActions">
              <CardButton
                mini={mini}
                onClick={handleClickEdit}
                startIcon={<Edit />}
              >
                <span className="TaskActionLabel">Edit</span>
              </CardButton>
              {effortPoints > 1 && (
                <CardButton
                  mini={mini}
                  onClick={handleClickSplit}
                  startIcon={<CallSplit />}
                >
                  <span className="TaskActionLabel">Split</span>
                </CardButton>
              )}
              <CardButton
                mini={mini}
                onClick={handleClickClose}
                startIcon={<Close />}
              >
                <span className="TaskActionLabel">Close</span>
              </CardButton>
            </CardActions>
          </Card>
        </motion.div>
      </>
    );
  }
);

export default memo(TaskListItem);
