import { useCallback, useMemo } from "react";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

import db from "../db";
import { SettingsItem } from "../types";
import { useSelectSingle } from "./useSelectSingle";

export const useSettings = <T extends {}>(
  name: string,
  initialValue: T
): { value: T; handleEditSetting: (newValue: T) => void } => {
  const settingsTable = useMemo(async () => (await db).settings, []);
  const query = useMemo(
    () => ({
      selector: {
        name: {
          $eq: name,
        },
      },
    }),
    [name]
  );

  const [value] = useSelectSingle<SettingsItem<T>>(
    settingsTable,
    // @ts-expect-error weird due to SettingsItem<T> typing
    query
  );

  const handleEditSetting = useCallback(
    async (newValue: T) => {
      const resolvedTable = await settingsTable;

      await settingsTable;

      const oldSetting = await resolvedTable
        .findOne({ selector: { name } })
        .exec();

      if (oldSetting) {
        // TODO keeps pushing wrong value
        await oldSetting.patch({ value: newValue });
      } else {
        const id = uuidv4();
        await resolvedTable.insert({ id, name, value: newValue });
      }
    },
    [name, settingsTable]
  );

  return { value: value ? value.value : initialValue, handleEditSetting };
};
