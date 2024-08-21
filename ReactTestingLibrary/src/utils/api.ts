import axios, { AxiosInstance, AxiosResponse } from "axios";
import { User } from "../types/User";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3001",
});

export const ApiEndpoints = {
  getUsers: "/users",
  getUserByEmail: (email: string) => `/users?email=${email}`,
  createUser: "/users",
  getUserById: (id: string) => `/users?id=${id}`,
};

export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    const response: AxiosResponse<User[]> = await api.get(
      ApiEndpoints.getUserByEmail(email)
    );
    const user = response.data[0];
    if (user && user.password === password) {
      return user;
    }
    throw new Error("Invalid email or password");
  },

  signUp: async (
    email: string,
    fullName: string,
    password: string
  ): Promise<User> => {
    const existingUserResponse: AxiosResponse<User[]> = await api.get(
      ApiEndpoints.getUserByEmail(email)
    );
    if (existingUserResponse.data.length > 0) {
      throw new Error("Email is already registered");
    }

    const id = fullName.replace(/\s/g, "").toLowerCase();
    const response: AxiosResponse<User> = await api.post(
      ApiEndpoints.createUser,
      {
        id,
        name: fullName,
        password,
        email,
      }
    );
    return response.data;
  },
};

export default api;
