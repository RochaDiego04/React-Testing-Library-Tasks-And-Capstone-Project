import userEvent from "@testing-library/user-event";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignUp from "../SignUp";
import { useAuth } from "../../hooks/useAuth";

jest.mock("../../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("SignUp Component", () => {
  const mockHandleSignUp = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockImplementation(() => ({
      handleSignUp: mockHandleSignUp,
      status: "idle",
      error: null,
    }));
  });

  it("submits the form with correct values", async () => {
    const { container } = render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/FullName/i), "John Doe");
    await userEvent.type(screen.getByLabelText(/Email/i), "test@gmail.com");
    await userEvent.type(container.querySelector("#password"), "12345678");
    await userEvent.type(
      screen.getByLabelText(/Password Confirmation/i),
      "12345678"
    );

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /sign up/i })
      ).not.toBeDisabled()
    );

    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockHandleSignUp).toHaveBeenCalledWith(
        "test@gmail.com",
        "John Doe",
        "12345678"
      );
    });
  });

  it("redirects to home after successful signup", async () => {
    (useAuth as jest.Mock).mockImplementation(() => ({
      handleSignUp: mockHandleSignUp,
      status: "succeeded",
      error: null,
    }));

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("shows an error message on failed signup", async () => {
    const errorMessage = "Signup failed";
    (useAuth as jest.Mock).mockImplementation(() => ({
      handleSignUp: mockHandleSignUp.mockRejectedValue(new Error(errorMessage)),
      status: "failed",
      error: errorMessage,
    }));

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("disables button during submission", async () => {
    (useAuth as jest.Mock).mockImplementation(() => ({
      handleSignUp: mockHandleSignUp,
      status: "loading",
    }));

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /sign up/i });
    userEvent.click(button);

    await waitFor(() => {
      expect(mockHandleSignUp).not.toHaveBeenCalled();
    });
  });

  it("shows validation errors", async () => {
    const { container } = render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const fullNameInput = screen.getByLabelText(/FullName/i);
    await userEvent.click(fullNameInput);
    await userEvent.tab();

    const emailInput = screen.getByLabelText(/Email/i);
    await userEvent.click(emailInput);
    await userEvent.tab();

    const passwordInput = container.querySelector("#password");
    await userEvent.click(passwordInput!);
    await userEvent.tab();

    const confirmInput = screen.getByLabelText(/Password Confirmation/i);
    await userEvent.click(confirmInput);
    await userEvent.tab();

    await waitFor(() => {
      expect(screen.getByText(/Full name is required/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText(/passwordConfirmation is a required field/i)
      ).toBeInTheDocument();
    });
  });
});
