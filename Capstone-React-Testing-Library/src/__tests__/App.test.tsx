// App.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import authReducer, { AuthState } from "../auth/authSlice";
import App from "../App";

import { configureStore, Store, UnknownAction } from "@reduxjs/toolkit";

function createTestStore(preloadedState?: { auth: AuthState }) {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });
}

describe("App Component", () => {
  let store: Store<unknown, UnknownAction, unknown>;

  beforeEach(() => {
    window.history.pushState({}, "", "/");
    store = createTestStore();
  });

  it("redirects to login when not authenticated", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /login/i })
      ).toBeInTheDocument();
    });
  });

  it("allows access to protected route when authenticated", async () => {
    store = createTestStore({
      auth: {
        user: {
          name: "Test User",
          email: "test@gmail.com",
        },
        status: "succeeded",
        error: null,
      },
    });

    window.history.pushState({}, "", "/projects");

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /your projects/i })
      ).toBeInTheDocument();
    });
  });

  it("shows not found for invalid routes", async () => {
    window.history.pushState({}, "", "/invalid-route");

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    });
  });
});
