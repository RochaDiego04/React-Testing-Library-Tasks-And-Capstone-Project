export type Task = {
  dueDate: string | Date;
  id: number;
  title: string;
  description: string;
  priorLevel: "low" | "medium" | "high";
  completed: boolean;
  projectId: number | string;
};
