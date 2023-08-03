import { useCallback, useMemo } from 'react';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

import db from '../../../utils/db';
import { useSelect } from '../../../utils/hooks';
import { Tag } from '../../../utils/types';

export const useTagMethods = () => {
  const tagsTable = useMemo(async () => (await db).tags, []);
  const tags = useSelect<Tag>(tagsTable, { sort: [{ name: "asc" }] });

  const handleAddTag = useCallback(
    async (name: string) => {
      const id = uuidv4();
      (await tagsTable).insert({ id, name });

      return id;
    },
    [tagsTable]
  );

  return { tags, handleAddTag };
};
