// @ts-ignore
import binPack from "bin-pack-with-constraints";

import { Task } from "./types";

type PackResult = {
  width?: number;
  height?: number;
  items: {
    x?: number;
    y?: number;
    width: number;
    height: number;
    item: Task;
  }[];
};

export const pack = (
  tasks: Task[],
  width: number = 1024,
  strategy: "bin" | "none" | "experimental" = "none"
): PackResult => {
  const tasksWithDimensions = tasks?.map((task) => ({
    ...task,
    width: 160 * Math.sqrt(task.effortPoints),
    height: 160 * Math.sqrt(task.effortPoints),
  }));

  switch (strategy) {
    case "bin":
      return binPack(tasksWithDimensions || [], {
        maxWidth: width,
      });
    case "experimental":
      const slots: { x0: number; x1: number; y: number }[] = [
        { x0: 0, x1: width, y: 0 },
      ];
      return {
        items: tasksWithDimensions.map(
          ({ width: itemWidth, height: itemHeight, ...item }) => {
            slots.sort((a, b) => {
              const value = a.y - b.y;
              return value;
            });

            console.log(slots[slots.length - 1].y);

            const fittingSlot = slots.find(
              ({ x0, x1 }) => x1 - x0 > itemWidth
            )!;
            const fittingIndex = slots.indexOf(fittingSlot);

            console.log(fittingSlot);

            const itemDimensions = {
              x: fittingSlot.x0,
              y: fittingSlot.y,
              width: itemWidth,
              height: itemHeight,
              item,
            };

            slots.splice(fittingIndex, 1);
            const itemRight = itemDimensions.x + itemWidth;
            slots.push({
              x0: itemDimensions.x,
              x1: itemRight,
              y: itemHeight,
            });
            slots.push({
              x0: itemRight,
              x1: width,
              // TODO inefficient
              //   y: Math.max(...slots.map(({ y }) => y)),
              y: 0,
            });
            slots.push({
              x0: 0,
              x1: width,
              y: itemHeight,
            });

            return itemDimensions;
          }
        ),
      };
      break;
  }
  return {
    items: tasksWithDimensions.map(({ width, height, ...item }) => ({
      width,
      height,
      item,
    })),
  };
};
