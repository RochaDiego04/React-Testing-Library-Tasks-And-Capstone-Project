import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProjectProgressBar from "../ProjectProgressBar";
import { Task } from "../../types/Task";

describe("ProjectProgressBar", () => {
  const mockTasks: Task[] = [
    {
      dueDate: "2025-04-17",
      id: 101,
      title: "Plan team meeting",
      description:
        "Prepare agenda and send invites for the upcoming team meeting.",
      priorLevel: "medium",
      completed: false,
      projectId: 501,
    },
    {
      dueDate: new Date("2025-04-25").toISOString(),
      id: 102,
      title: "Submit project proposal",
      description: "Finalize the proposal and submit it for review.",
      priorLevel: "high",
      completed: true,
      projectId: 501,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correct completion percentage for mixed tasks", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <ProjectProgressBar tasks={mockTasks} />
      </MemoryRouter>
    );
    expect(screen.getByText("50%")).toBeInTheDocument();

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("value", "50");
    expect(progressBar).toHaveAttribute("max", "100");
  });

  it("renders 0% when there are no tasks", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <ProjectProgressBar tasks={[]} />
      </MemoryRouter>
    );
    expect(screen.getByText("0%")).toBeInTheDocument();

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("value", "0");
    expect(progressBar).toHaveAttribute("max", "100");
  });
});
