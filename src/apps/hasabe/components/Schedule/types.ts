export enum Days {
  mon = "Mon",
  tue = "Tue",
  wed = "Wed",
  thu = "Thu",
  fri = "Fri",
  sat = "Sat",
  sun = "Sun",
}

export type Day = keyof typeof Days;

export enum Periods {
  morning = "Morning",
  lunchtime = "Lunchtime",
  afternoon = "Afternoon",
  evening = "Evening",
}

export type Period = keyof typeof Periods;

export type CalendarState = {
  [key in Day]: {
    [key in Period]: string | null;
  };
};

export type CalendarChangePayload = {
  day: Day;
  period: Period;
  tag: string | null;
};
