import { Task } from "./types";
import { getColor, move, moveItem, moveTaskDown, moveTaskUp } from "./utils";

import MOCK_TASKS from "./__mocks__/mock-tasks.json";

describe("move", () => {
  it("moves", () => {
    expect(move([{ _id: 1 }, { _id: 2 }, { _id: 3 }], 2, 1)).toEqual([
      { _id: 1 },
      { _id: 3 },
      { _id: 2 },
    ]);
  });
});

describe("moveItem", () => {
  it("moves", () => {
    expect(
      moveItem(
        [{ _id: 1 }, { _id: 2 }, { _id: 3 }],
        (item) => item._id === 3,
        1
      )
    ).toEqual([{ _id: 1 }, { _id: 3 }, { _id: 2 }]);
  });
});

describe("moveTaskUp", () => {
  it("moves", () => {
    expect(
      // @ts-ignore // TODO
      moveTaskUp(MOCK_TASKS, "fa3fe8bc-5f4a-4d55-810b-5d95f96a49be")
    ).toEqual([MOCK_TASKS[0], MOCK_TASKS[2], MOCK_TASKS[1]]);
  });
});

describe("moveTaskDown", () => {
  it("moves", () => {
    expect(
      // @ts-ignore // TODO
      moveTaskDown(MOCK_TASKS, "2ba38411-af53-4c55-8607-341e20475a0f")
    ).toEqual([MOCK_TASKS[0], MOCK_TASKS[2], MOCK_TASKS[1]]);
  });
});

// TODO brittle - will be defunct when users can choose their own colors
describe("getColor", () => {
  it("shows red for bad", () => {
    expect(getColor(21)).toBe("hsla(0, 80%, 40%, 0.5)");
  });
  it("shows green for good", () => {
    expect(getColor(1)).toBe("hsla(126, 80%, 40%, 0.5)");
  });
});
