import { useEffect } from "react";
import { useUser } from "../context/user";

// Call useUser() on mount
const Login = () => {
  const { login } = useUser();

  useEffect(login, []);

  return <p>Logging in</p>;
};

export default Login;
