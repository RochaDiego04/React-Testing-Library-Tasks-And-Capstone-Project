import { User } from "../../types/User";
import { authApi } from "../../utils/api";
import authReducer, {
  login,
  signUp,
  logout,
  setUser,
  AuthState,
} from "../authSlice";

jest.mock("../../utils/api", () => ({
  authApi: {
    login: jest.fn(),
    signUp: jest.fn(),
  },
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

describe("auth slice", () => {
  const initialState: AuthState = {
    user: null,
    status: "idle",
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle initial state", () => {
    expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("reducers", () => {
    it("should handle logout", () => {
      const previousState: AuthState = {
        ...initialState,
        user: mockUser,
        status: "succeeded",
      };

      const state = authReducer(previousState, logout());

      expect(state).toEqual({
        user: null,
        status: "idle",
        error: null,
      });
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("user");
    });

    it("should handle setUser", () => {
      const state = authReducer(initialState, setUser(mockUser));

      expect(state).toEqual({
        user: mockUser,
        status: "succeeded",
        error: null,
      });
    });
  });

  describe("async thunks", () => {
    describe("thunk implementations", () => {
      it("login thunk should call authApi.login with credentials", async () => {
        const credentials = {
          email: "test@example.com",
          password: "password123",
        };
        (authApi.login as jest.Mock).mockResolvedValue(mockUser);

        const dispatch = jest.fn();
        const getState = jest.fn();

        await login(credentials)(dispatch, getState, undefined);

        expect(authApi.login).toHaveBeenCalledWith(
          credentials.email,
          credentials.password
        );
      });

      it("signUp thunk should call authApi.signUp with user data", async () => {
        const userData = {
          email: "test@example.com",
          fullName: "Test User",
          password: "password123",
        };
        (authApi.signUp as jest.Mock).mockResolvedValue(mockUser);

        const dispatch = jest.fn();
        const getState = jest.fn();

        await signUp(userData)(dispatch, getState, undefined);

        expect(authApi.signUp).toHaveBeenCalledWith(
          userData.email,
          userData.fullName,
          userData.password
        );
      });
    });

    describe("login", () => {
      it("should handle pending", () => {
        const action = login.pending("", { email: "", password: "" });
        const state = authReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          status: "loading",
        });
      });

      it("should handle fulfilled", () => {
        const action = login.fulfilled(mockUser, "", {
          email: "",
          password: "",
        });
        const state = authReducer(initialState, action);

        expect(state).toEqual({
          user: mockUser,
          status: "succeeded",
          error: null,
        });
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          "user",
          JSON.stringify(mockUser)
        );
      });

      it("should handle rejected", () => {
        const errorMessage = "Rejected Error";
        const action = login.rejected(new Error(errorMessage), "", {
          email: "",
          password: "",
        });
        const state = authReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          status: "failed",
          error: errorMessage,
        });
      });
      it("should handle rejected with default login error", () => {
        const action = login.rejected(
          {
            name: "Error",
          },
          "requestId",
          {
            email: "test@example.com",
            password: "password123",
          }
        );

        const state = authReducer(initialState, action);
        expect(state.error).toBe("Login failed");
      });
    });

    describe("signUp", () => {
      it("should handle pending", () => {
        const action = signUp.pending("", {
          email: "",
          fullName: "",
          password: "",
        });
        const state = authReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          status: "loading",
        });
      });

      it("should handle fulfilled", () => {
        const action = signUp.fulfilled(mockUser, "", {
          email: "",
          fullName: "",
          password: "",
        });
        const state = authReducer(initialState, action);

        expect(state).toEqual({
          user: mockUser,
          status: "succeeded",
          error: null,
        });
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          "user",
          JSON.stringify(mockUser)
        );
      });

      it("should handle rejected", () => {
        const errorMessage = "Signup Failed";
        const action = signUp.rejected(new Error(errorMessage), "", {
          email: "",
          fullName: "",
          password: "",
        });
        const state = authReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          status: "failed",
          error: errorMessage,
        });
      });

      it("should handle rejected with default error message", () => {
        const action = signUp.rejected(
          {
            name: "Error",
          },
          "requestId",
          {
            email: "test@example.com",
            fullName: "Test User",
            password: "password123",
          }
        );

        const state = authReducer(initialState, action);
        expect(state.error).toBe("Sign up failed");
      });
    });
  });
});
