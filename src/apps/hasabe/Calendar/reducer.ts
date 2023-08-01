import { CalendarState, Days, Periods } from "./types";

export const DEFAULT_CALENDAR_STATE: CalendarState = {
  mon: {
    morning: null,
    lunchtime: null,
    afternoon: null,
    evening: null,
  },
  tue: {
    morning: null,
    lunchtime: null,
    afternoon: null,
    evening: null,
  },
  wed: {
    morning: null,
    lunchtime: null,
    afternoon: null,
    evening: null,
  },
  thu: {
    morning: null,
    lunchtime: null,
    afternoon: null,
    evening: null,
  },
  fri: {
    morning: null,
    lunchtime: null,
    afternoon: null,
    evening: null,
  },
  sat: {
    morning: null,
    lunchtime: null,
    afternoon: null,
    evening: null,
  },
  sun: {
    morning: null,
    lunchtime: null,
    afternoon: null,
    evening: null,
  },
};

export const calendarReducer = (
  state: CalendarState,
  payload: {
    day: keyof typeof Days;
    period: keyof typeof Periods;
    tag: string | null;
  }
) => {
  return {
    ...state,
    [payload.day]: { ...state[payload.day], [payload.period]: payload.tag },
  };
};
