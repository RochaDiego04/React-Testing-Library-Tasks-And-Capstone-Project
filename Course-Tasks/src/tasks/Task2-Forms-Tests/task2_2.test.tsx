import MessageForm from "./task2_2";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("updates message on input change", async () => {
  render(<MessageForm />);

  const input = screen.getByRole("textbox");

  await userEvent.type(input, "hello");

  expect(input).toHaveValue("hello");

  // Displayed in the paragprah
  expect(screen.getByText("Message: hello")).toBeInTheDocument();
});
