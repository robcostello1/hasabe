export type Task = {
  _id: string;
  _rev?: string;
  type: "task";
  name: string;
  body: string;
  effortPoints: number;
  worryPoints: number;
};

export type EditableTask = Omit<Task, "_id">;

export type UpdateMode = "single" | "split";
