import { fireEvent, render, screen } from "@testing-library/react";
import { TodoList } from "./task1";

test("renders todo list and adds a new todo", () => {
  render(<TodoList />);
  const title = screen.getByText("Todo List");
  const item1 = screen.getByText("Learn React");
  const item2 = screen.getByText("Write Tests");
  const button = screen.getByRole("button", { name: /Add Todo/i });
  const input = screen.getByPlaceholderText(/Add new todo/i);

  expect(title).toBeInTheDocument();
  expect(item1).toBeInTheDocument();
  expect(item2).toBeInTheDocument();
  expect(button).toBeInTheDocument();
  expect(input).toBeInTheDocument();

  const newTodoText = "New test todo";

  fireEvent.change(input, { target: { value: newTodoText } });
  expect(input).toHaveValue(newTodoText);

  fireEvent.click(button);
  const newTodoItem = screen.getByText(newTodoText);
  expect(newTodoItem).toBeInTheDocument();

  expect(input).toHaveValue("");
});

test("handles empty input correctly", () => {
  render(<TodoList />);
  const input = screen.getByPlaceholderText(/Add new todo/i);
  const button = screen.getByRole("button", { name: /Add Todo/i });
  const initialTodos = screen.getAllByTestId("todo-item");

  fireEvent.change(input, { target: { value: "    " } });

  fireEvent.click(button);

  const currentTodos = screen.getAllByTestId("todo-item");
  expect(currentTodos.length).toBe(initialTodos.length);
  expect(input).toHaveValue("    ");
});

test("verifies findBy for asynchronous behavior", async () => {
  render(<TodoList />);

  const title = await screen.findByText("Todo List");
  expect(title).toBeInTheDocument();

  const items = await screen.findAllByTestId("todo-item");
  expect(items.length).toBe(2);
});
