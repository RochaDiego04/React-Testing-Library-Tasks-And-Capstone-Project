import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedComponent from "./task3_2";
import { render, screen } from "@testing-library/react";

test("redirects to login if not authenticated", () => {
  localStorage.removeItem("token");

  render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route path="/protected" element={<ProtectedComponent />} />
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText("Login page")).toBeInTheDocument();
});

test("renders protected content when authenticated", () => {
  localStorage.setItem("token", "dummy-token");

  render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route path="/protected" element={<ProtectedComponent />} />
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText("Protected Content")).toBeInTheDocument();

  localStorage.removeItem("token");
});
