import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Project } from "../types/Project";
import AddProjectForm from "../components/AddProjectForm";

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:3001/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects", error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectAdded = (newProject: Project) => {
    setProjects([...projects, newProject]);
  };

  return (
    <div>
      <h2>Your Projects</h2>
      <AddProjectForm onProjectAdded={handleProjectAdded} />
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            style={{ display: "flex", alignItems: "center", gap: "2rem" }}
          >
            <Link to={`/projects/${project.id}`}>{project.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Projects;
