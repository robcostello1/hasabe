import { useMemo } from "react";

import db from "../../../utils/db";
import { useSelect } from "../../../utils/hooks";
import { Tag } from "../../../utils/types";

export const useTagMethods = () => {
  const tagsTable = useMemo(async () => (await db).tags, []);
  const tags = useSelect<Tag>(tagsTable, { sort: [{ name: "asc" }] });
  return { tags };
};
