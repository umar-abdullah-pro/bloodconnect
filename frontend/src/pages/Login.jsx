import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      navigate("/dashboard");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      <input name="email" type="email" placeholder="Email" required />

      <input name="password" type="password" placeholder="Password" required />

      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
