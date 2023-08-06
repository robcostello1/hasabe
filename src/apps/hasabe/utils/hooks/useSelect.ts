import { useEffect, useRef, useState } from 'react';
import { Subscription } from 'react-hook-form/dist/utils/createSubject';
import { MangoQuery, RxCollection } from 'rxdb';

export const useSelect = <T extends { id: string }>(
  table: Promise<RxCollection>,
  queryObj?: MangoQuery<T>
) => {
  const subscription = useRef<Subscription>();
  const [entities, setEntities] = useState<T[]>([]);

  useEffect(() => {
    (async () => {
      const tableReady = await table;
      if (tableReady) {
        subscription.current?.unsubscribe();

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
  }, [table, queryObj]);

  return entities;
};
