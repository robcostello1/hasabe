import "./Calendar.css";

import { TagSelectorField } from "../../components/Forms/TagSelector";
import { enumKeys, Tag } from "../../utils/types";
import {
  CalendarChangePayload,
  CalendarState,
  Day,
  Days,
  Periods,
} from "../types";

type CalendarProps = {
  availableTags: Tag[];
  state: CalendarState;
  onChange: (payload: CalendarChangePayload) => void;
};

const Calendar = ({ availableTags, state, onChange }: CalendarProps) => {
  return (
    <table className="CalendarTable">
      <thead>
        <tr>
          <th key={"day-label"} />
          {(Object.keys(state) as Day[]).map((day) => (
            <th key={day}>{Days[day]}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {enumKeys(Periods).map((period) => (
          <tr key={period}>
            <td key="period-label">{Periods[period]}</td>
            {(Object.keys(state) as Day[]).map((day) => (
              <td key={`${period}-${day}`}>
                <TagSelectorField
                  onChange={(value) => onChange({ day, period, tag: value })}
                  tags={availableTags}
                  value={state[day][period]}
                  label=""
                  TextFieldProps={{
                    variant: "standard",
                  }}
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
