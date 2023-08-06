import { useEffect, useMemo, useRef, useState } from 'react';
import { Subscription } from 'react-hook-form/dist/utils/createSubject';
import { MangoQuery, RxCollection } from 'rxdb';

export const useSelect = <T extends { id: string }>(
  table: Promise<RxCollection>,
  queryObj?: MangoQuery<any>
) => {
  const subscription = useRef<Subscription>();
  const [entities, setEntities] = useState<T[]>([]);

  const queryObjectComp = useMemo(() => JSON.stringify(queryObj), [queryObj]);

  useEffect(
    () => {
      (async () => {
        const tableReady = await table;
        if (tableReady) {
          subscription.current?.unsubscribe();

          console.log("queryObj", queryObj);

          subscription.current = tableReady
            .find(queryObj)
            .$.subscribe((newEntities) => {
              setEntities(newEntities.map((entity) => entity.toJSON()));
            });
        }
      })();

      return () => {
        subscription.current?.unsubscribe();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, queryObjectComp]
  );

  return entities;
};
