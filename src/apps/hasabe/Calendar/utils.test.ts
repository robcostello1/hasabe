import { getCurrentPeriod } from "./utils";

describe("getCurrentPeriod", () => {
  it("Returns the correct period", () => {
    expect(
      getCurrentPeriod(Date.parse("Tue Aug 01 2023 12:55:11 GMT+0100"))
    ).toEqual("lunchtime");
  });
});
