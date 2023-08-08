import './CardButton.css';

import { Button, ButtonProps, Tooltip } from '@mui/material';

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
      <Button {...cardProps}>
        <span className="CardButton__MiniIcon">{startIcon}</span>
      </Button>
    </Tooltip>
  ) : (
    <Button {...cardProps} startIcon={startIcon}>
      {children}
    </Button>
  );
};

export default CardButton;
