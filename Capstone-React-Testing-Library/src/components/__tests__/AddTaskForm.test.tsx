import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import AddTaskForm from "../AddTaskForm";
import { Project } from "../../types/Project";
import { Task } from "../../types/Task";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AddTaskForm", () => {
  const mockProject: Project = { id: 1, name: "Project Alpha" };

  const mockOnTaskAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with all elements", () => {
    render(
      <AddTaskForm
        projectId={`${mockProject.id}`}
        onTaskAdded={mockOnTaskAdded}
      />
    );

    expect(
      screen.getByRole("heading", { name: /add a new task/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority level/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add task/i })
    ).toBeInTheDocument();
  });

  it("updates input fields when user types", async () => {
    render(
      <AddTaskForm
        projectId={`${mockProject.id}`}
        onTaskAdded={mockOnTaskAdded}
      />
    );
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/task title/i);
    const descInput = screen.getByLabelText(/description/i);
    const dueDateInput = screen.getByLabelText(/due date/i);
    const priotLevelInput = screen.getByLabelText(/priority level/i);

    await user.type(titleInput, "New Task");
    await user.type(descInput, "Task Description");
    await user.type(dueDateInput, "2023-10-01");
    await user.selectOptions(priotLevelInput, "High");

    expect(titleInput).toHaveValue("New Task");
    expect(descInput).toHaveValue("Task Description");
    expect(dueDateInput).toHaveValue("2023-10-01");
    expect(priotLevelInput).toHaveValue("high");
  });

  it("submits form with correct data", async () => {
    const mockNewTask: Task = {
      id: 103,
      title: "Newly Added Task",
      description: "New task description",
      priorLevel: "low",
      completed: false,
      projectId: Number(mockProject.id),
      dueDate: "2025-05-10",
    };
    mockedAxios.post.mockResolvedValueOnce({ data: mockNewTask });

    render(
      <AddTaskForm
        projectId={`${mockProject.id}`}
        onTaskAdded={mockOnTaskAdded}
      />
    );
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/task title/i), "Newly Added Task");
    await user.type(
      screen.getByLabelText(/description/i),
      "New task description"
    );
    await user.type(screen.getByLabelText(/due date/i), "2025-05-10");
    await user.selectOptions(screen.getByLabelText(/priority level/i), "Low");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:3001/tasks",
        {
          title: "Newly Added Task",
          description: "New task description",
          priorLevel: "low",
          completed: false,
          projectId: mockProject.id.toString(),
          dueDate: "2025-05-10",
        }
      );
    });
  });

  it("handles API errors gracefully", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockedAxios.post.mockRejectedValueOnce(new Error("API Error"));

    render(
      <AddTaskForm
        projectId={`${mockProject.id}`}
        onTaskAdded={mockOnTaskAdded}
      />
    );

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/task title/i), "Newly Added Task");
    await user.type(
      screen.getByLabelText(/description/i),
      "New task description"
    );
    await user.type(screen.getByLabelText(/due date/i), "2025-05-10");
    await user.selectOptions(screen.getByLabelText(/priority level/i), "Low");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error adding task",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("assign a default project id when it is not provided", async () => {
    const mockNewTask: Task = {
      id: 103,
      title: "Newly Added Task",
      description: "New task description",
      priorLevel: "low",
      completed: false,
      projectId: "defaultProjectId",
      dueDate: "2025-05-10",
    };
    mockedAxios.post.mockResolvedValueOnce({ data: mockNewTask });

    render(<AddTaskForm onTaskAdded={mockOnTaskAdded} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/task title/i), "Newly Added Task");
    await user.type(
      screen.getByLabelText(/description/i),
      "New task description"
    );
    await user.type(screen.getByLabelText(/due date/i), "2025-05-10");
    await user.selectOptions(screen.getByLabelText(/priority level/i), "Low");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:3001/tasks",
        {
          title: "Newly Added Task",
          description: "New task description",
          priorLevel: "low",
          completed: false,
          projectId: "defaultProjectId",
          dueDate: "2025-05-10",
        }
      );
    });
  });
});
