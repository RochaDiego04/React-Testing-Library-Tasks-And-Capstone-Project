import { useState, FormEvent } from "react";
import axios from "axios";

interface AddTaskFormProps {
  projectId?: string;
  onTaskAdded: (task: any) => void;
}

function AddTaskForm({ projectId, onTaskAdded }: AddTaskFormProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [priorLevel, setPriorLevel] = useState<string>("low");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newTask = {
        title,
        description,
        dueDate,
        priorLevel,
        projectId: projectId ?? "defaultProjectId",
        completed: false,
      };
      const response = await axios.post("http://localhost:3001/tasks", newTask);
      onTaskAdded(response.data);
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriorLevel("");
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a New Task</h3>
      <div>
        <label htmlFor="task-title">Task Title</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="due-date">Due Date</label>
        <input
          id="due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="priority-level">Priority Level</label>
        <select
          name="priority-level"
          id="priority-level"
          value={priorLevel}
          onChange={(e) => setPriorLevel(e.target.value)}
          required
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
}

export default AddTaskForm;
