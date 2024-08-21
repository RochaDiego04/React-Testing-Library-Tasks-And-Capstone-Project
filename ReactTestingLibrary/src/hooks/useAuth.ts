import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { login, logout, signUp, setUser } from "../auth/authSlice";
import { User } from "../types/User";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const handleLogin = (email: string, password: string) => {
    return dispatch(login({ email, password }));
  };

  const handleSignUp = (email: string, fullName: string, password: string) => {
    return dispatch(signUp({ email, fullName, password }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const initializeAuth = () => {
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      dispatch(setUser(JSON.parse(userFromStorage) as User));
    }
  };

  return {
    ...auth,
    handleLogin,
    handleSignUp,
    handleLogout,
    initializeAuth,
  };
};
