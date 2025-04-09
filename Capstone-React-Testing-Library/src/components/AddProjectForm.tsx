import { useState, FormEvent } from "react";
import axios from "axios";

interface AddProjectFormProps {
  onProjectAdded: (project: any) => void;
}

function AddProjectForm({ onProjectAdded }: AddProjectFormProps) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newProject = { name, description };
      const response = await axios.post(
        "http://localhost:3001/projects",
        newProject
      );
      onProjectAdded(response.data);
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error adding project", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a New Project</h3>
      <div>
        <label htmlFor="project-name">Project Name</label>
        <input
          id="project-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
      <button type="submit">Add Project</button>
    </form>
  );
}

export default AddProjectForm;
