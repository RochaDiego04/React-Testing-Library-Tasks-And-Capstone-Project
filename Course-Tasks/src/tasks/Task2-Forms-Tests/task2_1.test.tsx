import { render, screen } from "@testing-library/react";
import Counter from "./task2_1";
import userEvent from "@testing-library/user-event";

test("increments counter on button click", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  expect(screen.getByText(/count: 0/i)).toBeInTheDocument();

  const button = screen.getByRole("button", { name: /increment/i });
  await user.click(button);

  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
