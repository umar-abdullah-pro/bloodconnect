import { api } from "../services/api";

const Register = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      console.log(response);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>

      <input name="name" placeholder="Name" required />

      <input name="email" type="email" placeholder="Email" required />

      <input name="phone" placeholder="Phone" required />

      <input name="password" type="password" placeholder="Password" required />

      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
