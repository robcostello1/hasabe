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
