import "./TaskFilters.css";

import { useEffect, useState } from "react";

import { TextField } from "@mui/material";

import ScheduleUi from "../../../Schedule/ScheduleUi";
import { Tag } from "../../../utils/types";
import { TagList } from "../../Tags";

type TaskFiltersProps = {
  availableTags: Tag[];
  activeTags: (string | null)[];
  setSearch: (search: string | null) => void;
  onTagChange: (tag: Tag | null) => void;
};

const TaskFilters = ({
  availableTags,
  activeTags,
  onTagChange,
  setSearch,
}: TaskFiltersProps) => {
  const [scheduledTag, setScheduledTag] = useState<string | null>(null);

  useEffect(() => {
    console.log("scheduledTag", scheduledTag);
    if (scheduledTag) {
      onTagChange(availableTags.find((t) => t.id === scheduledTag) ?? null);
    }
  }, [availableTags, onTagChange, scheduledTag]);

  return (
    <div className="TaskFilters">
      <TextField
        sx={{ m: 0.5, ml: 0 }}
        size="small"
        label="Search"
        onChange={(e) => setSearch(e.target.value)}
      />

      <TagList
        disabled={!!scheduledTag}
        onTagClick={onTagChange}
        active={activeTags}
        tags={availableTags}
      />

      <ScheduleUi availableTags={availableTags} onChange={setScheduledTag} />
    </div>
  );
};

export default TaskFilters;
