import { Periods } from "./types";

const periodDefinition: Record<keyof typeof Periods, number> = {
  morning: Date.parse("01 Jan 1970 00:09:00 GMT"),
  lunchtime: Date.parse("01 Jan 1970 00:12:00 GMT"),
  afternoon: Date.parse("01 Jan 1970 00:14:00 GMT"),
  evening: Date.parse("01 Jan 1970 00:18:00 GMT"),
};

export const getCurrentPeriod = (timestamp: number) => {};
