import { Button, ButtonProps, Tooltip } from "@mui/material";
import "./CardButton.css";

type CardButtonProps = Pick<
  ButtonProps,
  "children" | "onClick" | "startIcon"
> & { mini?: boolean };

const CardButton = ({ children, startIcon, mini, onClick }: CardButtonProps) =>
  mini ? (
    <Tooltip title={children}>
      <Button
        className="CardButton"
        color="inherit"
        size="small"
        variant="outlined"
        onClick={onClick}
      >
        {startIcon}
      </Button>
    </Tooltip>
  ) : (
    <Button
      className="CardButton"
      color="inherit"
      size="small"
      variant="outlined"
      onClick={onClick}
      startIcon={startIcon}
    >
      {children}
    </Button>
  );

export default CardButton;
