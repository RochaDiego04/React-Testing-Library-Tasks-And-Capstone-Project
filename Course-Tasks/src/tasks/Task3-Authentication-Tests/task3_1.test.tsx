import userEvent from "@testing-library/user-event";
import LoginComponent from "./task3_1";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { login } from "./api";

jest.mock("./api", () => ({
  login: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("LoginComponent", () => {
  const mockOnLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (login as jest.Mock).mockReset();
    mockOnLogin.mockReset();
    mockNavigate.mockReset();

    Storage.prototype.setItem = jest.fn();
  });

  it("should allow user to enter username and password", () => {
    render(<LoginComponent onLogin={mockOnLogin} />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("password123");
  });

  it("should call login API and handle successful login", async () => {
    (login as jest.Mock).mockResolvedValue({ token: "fake-token" });

    render(<LoginComponent onLogin={mockOnLogin} />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(passwordInput, "password123");

    await userEvent.click(loginButton);

    await waitFor(() =>
      expect(login).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      })
    );
    await waitFor(() =>
      expect(localStorage.setItem).toHaveBeenCalledWith("token", "fake-token")
    );
    await waitFor(() =>
      expect(mockOnLogin).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      })
    );
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard")
    );
  });
});
