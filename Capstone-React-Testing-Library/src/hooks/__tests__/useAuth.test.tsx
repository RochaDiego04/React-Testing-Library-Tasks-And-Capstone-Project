import { useDispatch, useSelector } from "react-redux";
import { User } from "../../types/User";
import { act, renderHook } from "@testing-library/react";
import { useAuth } from "../useAuth";
import { login, logout, setUser, signUp } from "../../auth/authSlice";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("../../auth/authSlice", () => ({
  login: jest.fn(),
  signUp: jest.fn(),
  logout: jest.fn(),
  setUser: jest.fn(),
}));

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const mockUser: User = {
  id: "1",
  email: "test@example.com",
  name: "Test User",
};

describe("useAuth", () => {
  const mockDispatch = jest.fn();
  const mockUseSelector = useSelector as unknown as jest.Mock;
  const mockUseDispatch = useDispatch as unknown as jest.Mock;

  beforeEach(() => {
    mockUseDispatch.mockReturnValue(mockDispatch);
    mockUseSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: null,
          status: "idle",
          error: null,
        },
      })
    );
    jest.clearAllMocks();
  });

  test("returns initial auth state", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current).toEqual({
      user: null,
      status: "idle",
      error: null,
      handleLogin: expect.any(Function),
      handleSignUp: expect.any(Function),
      handleLogout: expect.any(Function),
      initializeAuth: expect.any(Function),
    });
  });

  describe("handleLogin", () => {
    it("dispatches login action", () => {
      const { result } = renderHook(() => useAuth());
      const credentials = { email: "test@test.com", password: "password" };

      act(() => {
        result.current.handleLogin(credentials.email, credentials.password);
      });

      expect(login).toHaveBeenCalledWith(credentials);
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  describe("handleSignUp", () => {
    it("dispatches signUp action", () => {
      const { result } = renderHook(() => useAuth());
      const userData = {
        email: "test@test.com",
        fullName: "Test User",
        password: "password",
      };

      act(() => {
        result.current.handleSignUp(
          userData.email,
          userData.fullName,
          userData.password
        );
      });

      expect(signUp).toHaveBeenCalledWith(userData);
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  describe("handleLogout", () => {
    it("dispatches logout action", () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.handleLogout();
      });

      expect(logout).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  describe("initializeAuth", () => {
    it("sets user from localStorage", () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.initializeAuth();
      });

      expect(localStorageMock.getItem).toHaveBeenCalledWith("user");
      expect(setUser).toHaveBeenCalledWith(mockUser);
      expect(mockDispatch).toHaveBeenCalled();
    });

    it("does nothing when no user in localStorage", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.initializeAuth();
      });

      expect(localStorageMock.getItem).toHaveBeenCalledWith("user");
      expect(setUser).not.toHaveBeenCalled();
    });
  });

  test("reflects updated auth state", () => {
    const authState = {
      user: mockUser,
      status: "succeeded",
      error: null,
    };

    mockUseSelector.mockImplementation((selector) =>
      selector({ auth: authState })
    );

    const { result } = renderHook(() => useAuth());

    expect(result.current).toMatchObject(authState);
  });
});
