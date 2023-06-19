import { useEffect, useState } from "react";
import { MangoQuery, RxCollection } from "rxdb";

export const useSelect = <T extends { id: string }>(
  table: Promise<RxCollection>,
  queryObj?: MangoQuery<any>
) => {
  const [entities, setEntities] = useState<T[]>([]);

  useEffect(() => {
    (async () => {
      (await table).find(queryObj).$.subscribe((newEntities) => {
        setEntities(newEntities.map((entity) => entity.toJSON()));
      });
    })();
  }, []);

  return entities;
};
