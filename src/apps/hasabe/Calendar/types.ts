export enum Days {
  mon = "Mon",
  tue = "Tue",
  wed = "Wed",
  thu = "Thu",
  fri = "Fri",
  sat = "Sat",
  sun = "Sun",
}

export enum Periods {
  morning = "Morning",
  lunchtime = "Lunchtime",
  afternoon = "Afternoon",
  evening = "Evening",
}

export type CalendarState = {
  [key in keyof typeof Days]: {
    [key in keyof typeof Periods]: string | null;
  };
};
