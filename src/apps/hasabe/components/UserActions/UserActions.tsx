import { useState } from "react";

import { AccountCircle } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, MenuList } from "@mui/material";

import { useLogout } from "../Auth/hooks";

const UserActions = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { handleLogout } = useLogout({ onSuccess: console.log });

  return (
    <div>
      <IconButton onClick={handleClick}>
        <AccountCircle />
      </IconButton>
      <Menu anchorEl={anchorEl} onClose={handleClose} open={open}>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default UserActions;
