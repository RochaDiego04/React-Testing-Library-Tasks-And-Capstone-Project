import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { User } from "../../types/User";
import ResponsiveAppBar from "../AppBar";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;

describe("ResponsiveAppBar", () => {
  const mockUser: User = {
    id: "1",
    email: "john@example.com",
    name: "John Doe",
    password: "password123",
  };

  const mockAuthState = {
    user: mockUser,
    status: "succeeded" as const,
    error: null,
    handleLogin: jest.fn(),
    handleSignUp: jest.fn(),
    handleLogout: jest.fn(),
    initializeAuth: jest.fn(),
  };

  const mockNavigate = jest.fn();
  const settings = ["Logout", "Profile", "Account"];

  beforeEach(() => {
    mockUseAuth.mockReturnValue(mockAuthState);
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to login when user is not authenticated", async () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthState,
      user: null,
      status: "succeeded",
    });

    render(<ResponsiveAppBar />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("handles logout action correctly", async () => {
    const user = userEvent.setup();
    render(<ResponsiveAppBar />);

    await user.click(screen.getByRole("button", { name: /Open settings/i }));
    await user.click(screen.getByText(/Logout/i));

    expect(mockAuthState.handleLogout).toHaveBeenCalled();
  });

  it("closes user menu after clicking logout", async () => {
    const user = userEvent.setup();
    render(<ResponsiveAppBar />);

    await user.click(screen.getByRole("button", { name: /Open settings/i }));
    await user.click(screen.getByText(/Logout/i));

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it('calls handleLogout only when clicking "Logout" menu item', async () => {
    const user = userEvent.setup();
    render(<ResponsiveAppBar />);

    await user.click(screen.getByRole("button", { name: /Open settings/i }));

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    await user.click(screen.getByText(/Logout/i));

    expect(mockAuthState.handleLogout).toHaveBeenCalledTimes(1);

    expect(settings[0]).toBe("Logout");
  });
});
