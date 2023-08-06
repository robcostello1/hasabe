import Color from 'colorjs.io';
import filter from 'lodash/filter';

import { POINT_SCALE } from './consts';
import { Task } from './types';

export const removeTask = (id: string, tasks?: Task[]): Task[] =>
  tasks ? filter(tasks, ({ id: currentId }) => currentId !== id) : [];

export const getColor = (
  points: number,
  color1 = "#034732",
  color2 = "#a62508"
) => {
  const maxPoints = POINT_SCALE[POINT_SCALE.length - 1].id;

  const color = new Color(color1);
  const redgreen = color.range(color2, {
    space: "hsl",
  });

  const value =
    (Math.cbrt(points / maxPoints) + Math.sqrt(points / maxPoints)) / 2;
  return redgreen(value).toString();
};

export const arrayRotate = <T>(arr: T[], reverse?: boolean) => {
  if (!arr.length) {
    return arr;
  }
  if (reverse) {
    arr.unshift(arr.pop() as T);
  } else {
    arr.push(arr.shift() as T);
  }
  return arr;
};
