import { filter, findIndex } from "lodash";
import { POINT_SCALE } from "./consts";
import { Task } from "./types";

export const move = <T>(
  array: T[],
  old_index: number,
  new_index: number
): T[] => {
  const newArray: (T | undefined)[] = [...array];
  if (new_index >= newArray.length) {
    var k = new_index - newArray.length + 1;
    while (k--) {
      newArray.push(undefined);
    }
  }
  newArray.splice(new_index, 0, newArray.splice(old_index, 1)[0]);
  return newArray as T[];
};

export const moveItem = <T>(
  array: T[],
  predicate: (item: T) => boolean,
  toIndex: number
) => {
  const fromIndex = findIndex(array, predicate);
  return move(array, fromIndex, toIndex);
};

export const moveTaskUp = (tasks: Task[], _id: string) => {
  const fromIndex = findIndex(tasks, (task) => task._id === _id);
  return fromIndex === 0 ? tasks : move(tasks, fromIndex, fromIndex - 1);
};

export const moveTaskDown = (tasks: Task[], _id: string) => {
  const fromIndex = findIndex(tasks, (task) => task._id === _id);
  return fromIndex === tasks.length - 1
    ? tasks
    : move(tasks, fromIndex, fromIndex + 1);
};

const square = (x: number) => x * x;
const hueMultiplier = 1;

export const getColor = (points: number) => {
  const maxPoints = POINT_SCALE[POINT_SCALE.length - 1].id;

  return `hsla(${Math.floor(
    (square(maxPoints - points) / square(maxPoints)) * 140 * hueMultiplier
  )}, 80%, 40%, 0.5)`;
};
