import './TaskListItem.css';

import { motion } from 'framer-motion';
import { memo, MouseEvent, ReactNode, useCallback, useMemo, useState } from 'react';
import { useWindowSize } from 'react-use';

import { CallSplit, Close, Edit } from '@mui/icons-material';
import { Card, CardActions, CardContent, ClickAwayListener, Menu } from '@mui/material';

import { Task } from '../../../utils/types';
import { getColor } from '../../../utils/utils';
import { CardButton } from '../../General';

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

  const handleClickEdit = useCallback(() => onClickEdit(id), [onClickEdit, id]);
  const handleClickSplit = useCallback(
    () => onClickSplit(id),
    [onClickSplit, id]
  );
  const handleClickClose = useCallback(
    () => onClickClose(id),
    [onClickClose, id]
  );

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
        onContextMenu={handleContextMenu}
      >
        <Card
          onClick={handleCardClick}
          style={cardStyle}
          className={active ? "Card Card__active" : "Card"}
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
};

export default memo(TaskListItem);
