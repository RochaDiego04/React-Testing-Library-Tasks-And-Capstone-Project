import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./api";

interface LoginComponentProps {
  onLogin: (credentials: { username: string; password: string }) => void;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { token } = await login({ username, password });
      localStorage.setItem("token", token);
      onLogin({ username, password });
      navigate("/dashboard");
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginComponent;
