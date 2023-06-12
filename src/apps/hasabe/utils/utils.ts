import Color from "colorjs.io";
import { filter, findIndex, max } from "lodash";

import { POINT_SCALE } from "./consts";
import { Task } from "./types";

export const removeTask = (id: string, tasks?: Task[]): Task[] =>
  tasks ? filter(tasks, ({ id: currentId }) => currentId !== id) : [];

export const getColor = (
  points: number,
  color1 = "#034732",
  color2 = "#C32B09"
) => {
  const maxPoints = POINT_SCALE[POINT_SCALE.length - 1].id;

  const color = new Color(color1);
  const redgreen = color.range(color2, {
    space: "hsl",
  });
  return redgreen(Math.sqrt(points / maxPoints)).toString();
};
