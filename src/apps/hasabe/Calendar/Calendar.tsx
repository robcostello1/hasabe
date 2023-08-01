import { useEffect, useReducer } from "react";

import { TagSelectorField } from "../components/Forms/TagSelector";
import { Tag } from "../utils/types";
import { calendarReducer, DEFAULT_CALENDAR_STATE } from "./reducer";
import { Days, Periods } from "./types";

type CalendarProps = {
  avaiableTags: Tag[];
  onChange: (tag: Tag) => void;
};

// TODO move to utils
function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

const Calendar = ({ avaiableTags }: CalendarProps) => {
  const [state, dispatch] = useReducer(calendarReducer, DEFAULT_CALENDAR_STATE);

  useEffect(() => {}, [state]);

  return (
    <table>
      <thead>
        <tr>
          <th key={"day-label"} />
          {(Object.keys(state) as (keyof typeof Days)[]).map((day) => (
            <th key={day}>{Days[day]}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {enumKeys(Periods).map((period) => (
          <tr key={period}>
            <td key="period-label">{Periods[period]}</td>
            {(Object.keys(state) as (keyof typeof Days)[]).map((day) => (
              <td key={`${period}-${day}`}>
                <TagSelectorField
                  onChange={(value) => dispatch({ day, period, tag: value })}
                  tags={avaiableTags}
                  value={state[day][period]}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Calendar;
