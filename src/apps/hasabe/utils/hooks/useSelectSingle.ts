import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Subscription } from "react-hook-form/dist/utils/createSubject";
import { MangoQuery, RxCollection } from "rxdb";

export const useSelectSingle = <T extends { id: string }>(
  table: Promise<RxCollection>,
  queryObj?: MangoQuery<T>
): [T | undefined, Dispatch<SetStateAction<T | undefined>>] => {
  const subscription = useRef<Subscription>();
  const [entity, setEntity] = useState<T>();

  useEffect(() => {
    (async () => {
      const tableReady = await table;
      if (tableReady) {
        subscription.current?.unsubscribe();

        subscription.current = tableReady
          // Query object is mutated in this function
          .findOne({ ...queryObj })
          .$.subscribe((newEntity) => {
            newEntity && setEntity(newEntity.toJSON());
          });
      }
    })();

    return () => {
      subscription.current?.unsubscribe();
    };
  }, [table, queryObj]);

  return [entity, setEntity];
};
