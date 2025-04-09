import { Task } from "../types/Task";

type ProjectProgressBarProps = {
  tasks: Task[];
};

export default function ProjectProgressBar({ tasks }: ProjectProgressBarProps) {
  const getCompletionPercentage = () => {
    const totalTasks = tasks.length;
    if (totalTasks === 0) return 0;
    const completedTasks = tasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <label htmlFor="completion-bar">Completion Progress</label>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <progress
          id="completion-bar"
          value={getCompletionPercentage()}
          max="100"
        ></progress>
        <span
          style={{
            color: "black",
            fontWeight: "bold",
          }}
        >
          {getCompletionPercentage()}%
        </span>
      </div>
    </div>
  );
}
