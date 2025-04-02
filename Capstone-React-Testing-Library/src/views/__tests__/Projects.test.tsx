import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { Project } from "../../types/Project";
import Projects from "../Projects";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../../components/AddProjectForm", () => ({
  __esModule: true,
  default: ({
    onProjectAdded,
  }: {
    onProjectAdded: (project: Project) => void;
  }) => (
    <button onClick={() => onProjectAdded({ id: 3, name: "New Project" })}>
      Add Projects
    </button>
  ),
}));

describe("Projects Component", () => {
  const mockProjects: Project[] = [
    { id: 1, name: "Project Alpha" },
    { id: 2, name: "Project Beta" },
  ];

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockProjects });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and display projects on initial render", async () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Project Beta")).toBeInTheDocument();
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:3001/projects"
    );
  });

  it("should add new project to the list when handleProjectAdded is called", async () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());

    const addButton = await screen.findByText("Add Projects");
    await userEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("New Project")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getAllByRole("listitem")).toHaveLength(3);
    });
  });

  it("should handle API error gracefully", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockedAxios.get.mockRejectedValue(new Error("Network Error"));

    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    expect(screen.queryByText("Project Alpha")).not.toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching projects",
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});
