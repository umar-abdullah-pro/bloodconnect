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
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <section className="w-full">
          <div className="mb-8 text-center">
            <img
              src="/assets/logo.png"
              alt="BloodConnect"
              className="mx-auto h-12 w-auto"
            />

            <p className="mt-6 text-sm font-medium text-[#b4232c]">
              Welcome back
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Sign in to BloodConnect
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your blood requests and donor connections.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#b4232c] focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#b4232c] focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-[#b4232c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#991b1b]"
            >
              Sign In
            </button>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-medium text-[#b4232c] hover:text-[#991b1b]"
              >
                Create one
              </a>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Login;
