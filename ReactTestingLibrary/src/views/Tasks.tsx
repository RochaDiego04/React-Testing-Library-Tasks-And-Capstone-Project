import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Task } from "../types/Task";
import { Project } from "../types/Project";
import AddTaskForm from "../components/AddTaskForm";

function TaskList() {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<string>("title");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        const projectResponse = await axios.get(
          `http://localhost:3001/projects/${id}`
        );
        setProject(projectResponse.data);

        const tasksResponse = await axios.get(
          `http://localhost:3001/tasks?projectId=${id}`
        );
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error("Error fetching project or tasks", error);
      }
    };

    fetchProjectAndTasks();
  }, [id]);

  const handleTaskAdded = (newTask: Task) => {
    setTasks([...tasks, newTask]);
  };

  const handleTaskCompletion = async (taskId: number) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === taskId);
      if (!taskToUpdate) {
        console.error("Task not found");
        return;
      }
      await axios.put(`http://localhost:3001/tasks/${taskId}`, {
        ...taskToUpdate,
        completed: !taskToUpdate.completed,
      });
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const handleTaskDelete = async (taskId: number) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "all") return true;
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .filter((task) => {
      return (
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const sortedTasks = filteredTasks.sort((a: Task, b: Task) => {
    if (sortKey === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortKey === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  return (
    <div>
      <h2>Tasks for Project: {project ? project.name : "Loading..."}</h2>
      <div>
        <label>Search: </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
        />
      </div>
      <div>
        <label>Filter: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>

        <label>Sort By: </label>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="title">Title</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>

      <AddTaskForm projectId={id} onTaskAdded={handleTaskAdded} />
      <ul>
        {sortedTasks.map((task) => (
          <li key={task.id}>
            <p>{task.title}</p>
            <p>{task.description}</p>
            <p>Status: {task.completed ? "Completed" : "Pending"}</p>
            <button onClick={() => handleTaskCompletion(task.id)}>
              {task.completed ? "Mark as Pending" : "Mark as Completed"}
            </button>
            <button onClick={() => handleTaskDelete(task.id)}>
              Delete Task
            </button>
          </li>
        ))}
      </ul>
      <Link to="/projects">Back to Projects</Link>
    </div>
  );
}

export default TaskList;
