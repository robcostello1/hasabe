import './TaskFilters.css';

import { useEffect, useState } from 'react';

import { TextField } from '@mui/material';

import ScheduleUi from '../../../Schedule/ScheduleUi';
import { Tag } from '../../../utils/types';
import { TagList } from '../../Tags';

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
    if (scheduledTag) {
      onTagChange(availableTags.find((t) => t.id === scheduledTag) ?? null);
    }
  }, [availableTags, onTagChange, scheduledTag]);

  return (
    <div className="TaskFilters">
      <TextField
        sx={{ mr: 1, mb: 1 }}
        size="small"
        label="Search"
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{ sx: { m: 0 } }}
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
