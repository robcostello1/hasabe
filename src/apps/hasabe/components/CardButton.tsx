import { Button, ButtonProps, Tooltip } from "@mui/material";
import "./CardButton.css";

type CardButtonProps = Pick<
  ButtonProps,
  "children" | "onClick" | "startIcon"
> & { mini?: boolean };

const CardButton = ({
  children,
  startIcon,
  mini,
  onClick,
}: CardButtonProps) => {
  const cardProps = {
    className: "CardButton",
    color: "inherit",
    size: "small",
    variant: "outlined",
    onClick,
  } as const;

  return mini ? (
    <Tooltip title={children}>
      <Button {...cardProps}>{startIcon}</Button>
    </Tooltip>
  ) : (
    <Button {...cardProps} startIcon={startIcon}>
      {children}
    </Button>
  );
};

export default CardButton;
