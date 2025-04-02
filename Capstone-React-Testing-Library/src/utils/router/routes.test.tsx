import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Login from "../../views/Login";
import authReducer, { AuthState } from "../../auth/authSlice";
import Home from "../../views/Home";

const createTestStore = (preloadedState?: { auth: AuthState }) =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });

describe("Router Component", () => {
  it("renders the Home component when authenticated", () => {
    const store = createTestStore({
      auth: {
        user: {
          name: "Test User",
          email: "test@gmail.com",
        },
        status: "succeeded",
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("heading", { name: /welcome to your task manager/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /view projects/i })
    ).toBeInTheDocument();
  });

  it("redirects to login when not authenticated", () => {
    const store = createTestStore({
      auth: { user: null, status: "idle", error: null },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.queryByRole("heading", { name: /welcome to your task manager/i })
    ).not.toBeInTheDocument();
  });
});
