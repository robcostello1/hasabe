import "./UtilityBar.css";

import { ReactNode } from "react";

type UtilityBarProps = {
  left?: ReactNode;
  middle?: ReactNode;
  right?: ReactNode;
};

const UtilityBar = ({ left, middle, right }: UtilityBarProps) => (
  <div className="UtilityBar">
    {left && <div>{left}</div>}

    {middle && <div>{middle}</div>}

    {right && <div>{right}</div>}
  </div>
);

export default UtilityBar;
