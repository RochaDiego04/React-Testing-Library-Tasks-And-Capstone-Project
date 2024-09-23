export type Task = {
  dueDate: string | Date;
  id: number;
  title: string;
  description: string;
  completed: boolean;
  projectId: number;
};
