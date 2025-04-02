import userEvent from "@testing-library/user-event";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../Login";
import { useAuth } from "../../hooks/useAuth";

jest.mock("../../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("LoginComponent", () => {
  const mockHandleLogin = jest.fn() as jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockImplementation(() => ({
      handleLogin: mockHandleLogin,
      status: "idle",
      error: null,
    }));
  });

  it("Form submission triggers handleLogin with correct credentials", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Login />
      </MemoryRouter>
    );

    await userEvent.type(
      screen.getByLabelText(/email address/i),
      "test@gmail.com"
    );
    await userEvent.type(screen.getByLabelText(/password/i), "12345678");

    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith(
        "test@gmail.com",
        "12345678"
      );
    });
  });

  it("should redirect to home on successful login", async () => {
    (useAuth as jest.Mock).mockImplementation(() => ({
      handleLogin: mockHandleLogin,
      status: "succeeded",
      error: null,
    }));

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Login />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("shows error message on failed login", async () => {
    const errorMessage = "Invalid credentials";
    (useAuth as jest.Mock).mockImplementation(() => ({
      handleLogin: mockHandleLogin.mockRejectedValue(new Error(errorMessage)),
      status: "failed",
      error: errorMessage,
    }));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("disables button during submission", async () => {
    (useAuth as jest.Mock).mockImplementation(() => ({
      handleLogin: mockHandleLogin,
      status: "loading",
    }));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /login/i });
    userEvent.click(button);

    await waitFor(() => {
      expect(mockHandleLogin).not.toHaveBeenCalled();
    });
  });

  it("shows validation errors", async () => {
    (useAuth as jest.Mock).mockImplementation(() => ({
      handleLogin: mockHandleLogin,
      status: "loading",
    }));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /login/i });
    userEvent.click(button);

    await waitFor(() => {
      expect(mockHandleLogin).not.toHaveBeenCalled();
    });
  });
});
