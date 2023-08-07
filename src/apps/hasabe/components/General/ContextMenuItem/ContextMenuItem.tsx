import { ReactNode } from "react";

import { Box, MenuItem, MenuItemProps } from "@mui/material";

import KeyboardShortcut from "../KeyboardShortcut";
import { KeyboardShortcutProps } from "../KeyboardShortcut/KeyboardShortcut";

type ContextMenuItemProps = {
  children: ReactNode;
  onClick: MenuItemProps["onClick"];
  shortcut?: KeyboardShortcutProps["keys"];
};

const ContextMenuItem = ({
  children,
  onClick,
  shortcut,
}: ContextMenuItemProps) => {
  return (
    <MenuItem onClick={onClick}>
      <Box
        width={1}
        display="flex"
        justifyContent="space-between"
        component="span"
      >
        <span>{children}</span>
        {shortcut && <KeyboardShortcut keys={shortcut} />}
      </Box>
    </MenuItem>
  );
};

export default ContextMenuItem;
