import { useMemo } from "react";

import { Button } from "@mui/material";

import db from "../../utils/db";
import { useSelect } from "../../utils/hooks";
import { Tag } from "../../utils/types";

const TagList = () => {
  const tagsTable = useMemo(async () => (await db).tags, []);
  const tasks = useSelect<Tag>(tagsTable, { sort: [{ name: "asc" }] });

  return (
    <div>
      Tags:
      {tasks.map((task) => (
        <Button variant="outlined" key={task.id}>
          {task.name}
        </Button>
      ))}
    </div>
  );
};

export default TagList;
