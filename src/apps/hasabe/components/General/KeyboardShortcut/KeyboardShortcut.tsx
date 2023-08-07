import "./KeyboardShortcut.css";

import classNames from "classnames";
import { Fragment } from "react";

import { Box } from "@mui/material";

export type KeyboardShortcutProps = {
  keys: ("up" | "down" | string)[];
};

const getIcon = (key: "up" | "down" | string) => {
  switch (key) {
    case "up":
      return "\u2191";
    case "down":
      return "\u2193";
  }
  return key;
};

const KeyboardShortcut = ({ keys }: KeyboardShortcutProps) => {
  return (
    <>
      {keys.map((key, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <Box color={"grey.600"} sx={{ ml: 0.5 }} component="span">
              +
            </Box>
          )}
          <Box
            sx={{ ml: 0.5, pl: 1, pr: 1 }}
            border={1}
            borderRadius={1}
            borderColor={"grey.400"}
            color={"grey.600"}
            component="span"
            className={classNames(
              "KeyboardShortcut",
              `KeyboardShortcut__${key}`
            )}
          >
            {getIcon(key)}
          </Box>
        </Fragment>
      ))}
    </>
  );
};

export default KeyboardShortcut;
