// dummy login method for task3_1.tsx

type loginProps = {
  username: string;
  password: string;
};

export async function login({ username, password }: loginProps) {
  console.log(username + password);
  return { token: "fake-token" };
}
