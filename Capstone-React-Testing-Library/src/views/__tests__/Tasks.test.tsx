import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Project } from "../../types/Project";
import { Task } from "../../types/Task";
import TaskList from "../Tasks";
import userEvent from "@testing-library/user-event";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../../components/AddTaskForm", () => ({
  __esModule: true,
  default: ({
    onTaskAdded,
    projectId,
  }: {
    onTaskAdded: (task: Task) => void;
    projectId: string;
  }) => {
    const mockNewTask: Task = {
      id: 103,
      title: "Newly Added Task",
      description: "New task description",
      priorLevel: "low",
      completed: false,
      projectId: Number(projectId),
      dueDate: "2025-05-10",
    };

    return (
      <button onClick={() => onTaskAdded(mockNewTask)}>Add Mock Task</button>
    );
  },
}));

describe("Tasks Component", () => {
  const mockProject: Project = {
    id: 501,
    name: "Test Project",
  };

  const mockTasks: Task[] = [
    {
      dueDate: "2025-04-10",
      id: 101,
      title: "Plan team meeting",
      description:
        "Prepare agenda and send invites for the upcoming team meeting.",
      priorLevel: "medium",
      completed: false,
      projectId: 501,
    },
    {
      dueDate: new Date("2025-04-15").toISOString(),
      id: 102,
      title: "Submit project proposal",
      description: "Finalize the proposal and submit it for review.",
      priorLevel: "high",
      completed: true,
      projectId: 501,
    },
  ];

  beforeEach(() => {
    // Mocking the project fetch
    mockedAxios.get.mockImplementation((url) => {
      if (url === `http://localhost:3001/projects/501`) {
        return Promise.resolve({ data: mockProject });
      } else if (url === "http://localhost:3001/tasks?projectId=501") {
        return Promise.resolve({ data: mockTasks });
      }
      return Promise.reject(new Error("Unexpected URL"));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch specific project and its tasks, display tasks on initial render", async () => {
    render(
      <MemoryRouter initialEntries={["/projects/501/tasks"]}>
        <Routes>
          <Route path="/projects/:id/tasks" element={<TaskList />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/title: plan team meeting/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText(/title: submit project proposal/i)
      ).toBeInTheDocument();
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:3001/projects/501"
    );

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:3001/tasks?projectId=501"
    );
  });

  it("should handle task added correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/projects/501/tasks"]}>
        <Routes>
          <Route path="/projects/:id/tasks" element={<TaskList />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/plan team meeting/i)).toBeInTheDocument();
    });

    const addButton = screen.getByRole("button", { name: /add mock task/i });
    await userEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/newly added task/i)).toBeInTheDocument();
    });
  });

  it("should handle task completion state toggle correctly", async () => {
    mockedAxios.put.mockResolvedValueOnce({ data: {} });

    render(
      <MemoryRouter initialEntries={["/projects/501/tasks"]}>
        <Routes>
          <Route path="/projects/:id/tasks" element={<TaskList />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/plan team meeting/i)).toBeInTheDocument();
    });

    const completionButton = screen.getByRole("button", {
      name: /Mark as Completed/i,
    });

    await userEvent.click(completionButton);

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        "http://localhost:3001/tasks/101",
        {
          ...mockTasks[0],
          completed: true,
        }
      );
    });

    await waitFor(() => {
      expect(completionButton).toHaveTextContent(/Mark as Pending/i);
    });
  });

  it("should handle task deletion correctly", async () => {
    mockedAxios.delete.mockResolvedValueOnce({});

    render(
      <MemoryRouter initialEntries={["/projects/501/tasks"]}>
        <Routes>
          <Route path="/projects/:id/tasks" element={<TaskList />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/plan team meeting/i)).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", {
      name: /delete task/i,
    });
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        "http://localhost:3001/tasks/101"
      );
    });

    await waitFor(() => {
      expect(screen.queryByText(/plan team meeting/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/submit project proposal/i)).toBeInTheDocument();
  });

  it("should filter tasks correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/projects/501/tasks"]}>
        <Routes>
          <Route path="/projects/:id/tasks" element={<TaskList />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText(/plan team meeting/i);

    const filterSelect = screen.getByLabelText(/filter:/i);
    await userEvent.selectOptions(filterSelect, "completed");

    await waitFor(() => {
      expect(screen.queryByText(/plan team meeting/i)).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/submit project proposal/i)).toBeInTheDocument();
    });

    await userEvent.selectOptions(filterSelect, "pending");

    await waitFor(() => {
      expect(screen.getByText(/plan team meeting/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.queryByText(/submit project proposal/i)
      ).not.toBeInTheDocument();
    });
  });

  it("should sort tasks correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/projects/501/tasks"]}>
        <Routes>
          <Route path="/projects/:id/tasks" element={<TaskList />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText(/plan team meeting/i);

    const sortSelect = screen.getByLabelText(/Sort By:/i);
    await userEvent.selectOptions(sortSelect, "priorLevel");

    await waitFor(() => {
      const taskTitles = screen
        .getAllByText(/title:/i)
        .map((el) => el.textContent);
      expect(taskTitles).toEqual([
        "Title: Submit project proposal",
        "Title: Plan team meeting",
      ]);
    });

    await userEvent.selectOptions(sortSelect, "dueDate");

    await waitFor(() => {
      const taskTitles = screen
        .getAllByText(/title:/i)
        .map((el) => el.textContent);
      expect(taskTitles).toEqual([
        "Title: Plan team meeting",
        "Title: Submit project proposal",
      ]);
    });
  });

  it("should search tasks correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/projects/501/tasks"]}>
        <Routes>
          <Route path="/projects/:id/tasks" element={<TaskList />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText(/plan team meeting/i);

    const searchInput = screen.getByPlaceholderText(/search tasks/i);
    await userEvent.type(searchInput, "proposal");

    await waitFor(() => {
      expect(screen.queryByText(/plan team meeting/i)).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/submit project proposal/i)).toBeInTheDocument();
    });
  });
});
