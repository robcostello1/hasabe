import { useSettings } from "apps/hasabe/utils/hooks/useSettings";
import { useEffect, useReducer, useRef, useState } from "react";
import { useLocalStorage } from "react-use";

import { CalendarViewDay } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button, Dialog, DialogContent, IconButton } from "@mui/material";

import { Tag } from "../../utils/types";
import Calendar from "../Calendar";
import { calendarReducer, DEFAULT_CALENDAR_STATE } from "../reducer";
import { CalendarState } from "../types";
import { getCurrentPeriod } from "../utils";

type ScheduleUiProps = {
  availableTags: Tag[];
  onChange: (tag: string | null) => void;
};

const ENABLED_SETTING_DEFAULT = {
  isEnabled: false,
};

const ScheduleUi = ({ availableTags, onChange }: ScheduleUiProps) => {
  const [calendarShown, setCalendarShown] = useState(false);
  // const [isEnabled, setIsEnabled] = useLocalStorage("scheduleEnabled", false);
  const {
    value: { isEnabled },
    handleEditSetting,
  } = useSettings("scheduleEnabled", ENABLED_SETTING_DEFAULT);

  // TODO sync to DB instead of local storage
  const [localState, setLocalState] = useLocalStorage<CalendarState>(
    "schedule",
    DEFAULT_CALENDAR_STATE
  );
  const [state, dispatch] = useReducer(calendarReducer, localState!);
  useEffect(() => {
    setLocalState(state);
  }, [state, setLocalState]);

  const timeoutRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (isEnabled) {
      clearTimeout(timeoutRef.current);

      const handleChange = () => {
        const { day, period } = getCurrentPeriod(Date.now());
        onChange(state[day][period]);
      };
      handleChange();
      timeoutRef.current = setInterval(handleChange, 10000);
    } else {
      onChange(null);
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [state, onChange, isEnabled]);

  return (
    <div>
      <Button
        sx={{ mr: 1, mb: 1 }}
        variant={isEnabled ? "contained" : "outlined"}
        startIcon={<CalendarViewDay />}
        onClick={() => {
          handleEditSetting({ isEnabled: !isEnabled });
        }}
      >
        Use schedule
      </Button>

      <IconButton sx={{ mr: 1, mb: 1 }} onClick={() => setCalendarShown(true)}>
        <SettingsIcon />
      </IconButton>

      <Dialog
        fullWidth={true}
        maxWidth="xl"
        open={calendarShown}
        onClose={() => setCalendarShown(false)}
        data-mui-color-scheme="dark"
      >
        <DialogContent>
          <Calendar
            availableTags={availableTags}
            state={state}
            onChange={dispatch}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleUi;
