import userEvent from "@testing-library/user-event";
import MouseEventTracker from "./task2_3";
import { fireEvent, render, screen } from "@testing-library/react";

test("updates message on single click", async () => {
  render(<MouseEventTracker />);

  const clickMessageParagraph = screen.getAllByRole("paragraph")[0];
  expect(clickMessageParagraph).toBeEmptyDOMElement();

  const button = screen.getByRole("button", { name: /mouse event button/i });

  await userEvent.click(button);
  expect(screen.getByText("Button Clicked!")).toBeInTheDocument();
});

test("updates message on double click", async () => {
  render(<MouseEventTracker />);

  const clickMessageParagraph = screen.getAllByRole("paragraph")[0];
  expect(clickMessageParagraph).toBeEmptyDOMElement();

  const button = screen.getByRole("button", { name: /mouse event button/i });

  await userEvent.dblClick(button);
  expect(screen.getByText("Button Double Clicked!")).toBeInTheDocument();
});

test("updates message on mouse over", () => {
  render(<MouseEventTracker />);

  const clickMessageParagraph = screen.getAllByRole("paragraph")[1];
  expect(clickMessageParagraph).toBeEmptyDOMElement();

  const button = screen.getByRole("button", { name: /mouse event button/i });
  fireEvent.mouseOver(button);

  expect(screen.getByText("Mouse Over Button")).toBeInTheDocument();
});

test("updates message on mouse out", () => {
  render(<MouseEventTracker />);

  const clickMessageParagraph = screen.getAllByRole("paragraph")[1];
  expect(clickMessageParagraph).toBeEmptyDOMElement();

  const button = screen.getByRole("button", { name: /mouse event button/i });
  fireEvent.mouseLeave(button);

  expect(screen.getByText("Mouse Left Button")).toBeInTheDocument();
});
