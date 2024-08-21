import React, { useState } from "react";

export const TodoList = () => {
  const [todos, setTodos] = useState(["Learn React", "Write Tests"]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, inputValue.trim()]);
      setInputValue("");
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {todos.map((todo, index) => (
          <li key={index} data-testid="todo-item">
            {todo}
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Add new todo"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={addTodo}>Add Todo</button>
    </div>
  );
};
