import { enumKeys } from "../../utils/types";
import { arrayRotate } from "../../utils/utils";
import { Day, Days, Period } from "./types";

const periodDefinition: Record<Period, number> = {
  evening: Date.parse("01 Jan 1970 18:0:00 GMT"),
  afternoon: Date.parse("01 Jan 1970 14:00:00 GMT"),
  lunchtime: Date.parse("01 Jan 1970 12:00:00 GMT"),
  morning: Date.parse("01 Jan 1970 09:00:00 GMT"),
};

const DAY_LENGTH = 86400000;

export const getCurrentPeriod = (
  timestamp: number
): { day: Day; period: Period } => {
  return {
    day: arrayRotate(enumKeys(Days), true)[new Date(timestamp).getDay()],
    period:
      (Object.entries(periodDefinition) as [Period, number][]).find(
        ([_, startTime]) => timestamp % DAY_LENGTH >= startTime
      )?.[0] || "evening",
  };
};
