import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import AddProjectForm from "../AddProjectForm";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AddProjectForm", () => {
  const mockOnProjectAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with all elements", () => {
    render(<AddProjectForm onProjectAdded={mockOnProjectAdded} />);

    expect(
      screen.getByRole("heading", { name: /add a new project/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add project/i })
    ).toBeInTheDocument();
  });

  it("updates input fields when user types", async () => {
    render(<AddProjectForm onProjectAdded={mockOnProjectAdded} />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/project name/i);
    const descInput = screen.getByLabelText(/description/i);

    await user.type(nameInput, "New Project");
    await user.type(descInput, "Project Description");

    expect(nameInput).toHaveValue("New Project");
    expect(descInput).toHaveValue("Project Description");
  });

  it("submits form with correct data", async () => {
    const mockProject = {
      id: 1,
      name: "New Project",
      description: "Project Description",
    };
    mockedAxios.post.mockResolvedValueOnce({ data: mockProject });

    render(<AddProjectForm onProjectAdded={mockOnProjectAdded} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/project name/i), "New Project");
    await user.type(
      screen.getByLabelText(/description/i),
      "Project Description"
    );
    await user.click(screen.getByRole("button", { name: /add project/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:3001/projects",
        {
          name: "New Project",
          description: "Project Description",
        }
      );
    });
  });

  it("calls onProjectAdded and resets form after successful submission", async () => {
    const mockProject = {
      id: 1,
      name: "New Project",
      description: "Project Description",
    };
    mockedAxios.post.mockResolvedValueOnce({ data: mockProject });

    render(<AddProjectForm onProjectAdded={mockOnProjectAdded} />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/project name/i);
    const descInput = screen.getByLabelText(/description/i);

    await user.type(nameInput, "New Project");
    await user.type(descInput, "Project Description");
    await user.click(screen.getByRole("button", { name: /add project/i }));

    await waitFor(() => {
      expect(mockOnProjectAdded).toHaveBeenCalledWith(mockProject);
    });
    await waitFor(() => {
      expect(nameInput).toHaveValue("");
    });
    await waitFor(() => {
      expect(descInput).toHaveValue("");
    });
  });

  it("handles API errors gracefully", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockedAxios.post.mockRejectedValueOnce(new Error("API Error"));

    render(<AddProjectForm onProjectAdded={mockOnProjectAdded} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/project name/i), "New Project");
    await user.type(
      screen.getByLabelText(/description/i),
      "Project Description"
    );
    await user.click(screen.getByRole("button", { name: /add project/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error adding project",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("shows validation errors for required fields", async () => {
    render(<AddProjectForm onProjectAdded={mockOnProjectAdded} />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole("button", { name: /add project/i });
    await user.click(submitButton);

    expect(screen.getByLabelText(/project name/i)).toBeInvalid();
    expect(screen.getByLabelText(/description/i)).toBeInvalid();
  });
});
