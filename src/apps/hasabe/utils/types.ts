// Tasks

export type Task = {
  id: string;
  name: string;
  body: string;
  effortPoints: number;
  worryPoints: number;
  orderIndex: string;
  // TODO string[]
  tags?: string;
};

export type EditableTask = Omit<Task, "id" | "orderIndex">;

export type UpdateMode = "single" | "split";

// Tags

export type Tag = {
  id: string;
  name: string;
};

// TODO move to utils
export function enumKeys<O extends object, K extends keyof O = keyof O>(
  obj: O
): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}
