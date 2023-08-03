import { useEffect } from 'react';

export const useLog = (value: any, label?: string) => {
  useEffect(() => {
    if (import.meta.env.MODE === "development") {
      const output = [];
      if (label) {
        output.push(label);
      }
      output.push(value);
      console.log(...output);
    }
  }, [value, label]);
};
