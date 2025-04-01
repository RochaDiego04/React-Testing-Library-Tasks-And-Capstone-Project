import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedComponent from "./task3_2";
import { render, screen } from "@testing-library/react";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Overriding global localStorage
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("ProtectedComponent", () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  test("redirects to login if not authenticated", () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/protected" element={<ProtectedComponent />} />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(localStorageMock.getItem).toHaveBeenCalledWith("token");
  });

  test("renders protected content when authenticated", () => {
    localStorageMock.getItem.mockReturnValue("dummy-token");

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/protected" element={<ProtectedComponent />} />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(localStorageMock.getItem).toHaveBeenCalledWith("token");
  });
});
