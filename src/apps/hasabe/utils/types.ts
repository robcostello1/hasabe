export type Task = {
  id: string;
  name: string;
  body: string;
  effortPoints: number;
  worryPoints: number;
};

export type EditableTask = Omit<Task, "id">;

export type UpdateMode = "single" | "split";
