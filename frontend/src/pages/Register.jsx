import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const passwordChecks = [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "One uppercase letter (A-Z)",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter (a-z)",
      valid: /[a-z]/.test(password),
    },
    {
      label: "One number (0-9)",
      valid: /\d/.test(password),
    },
    {
      label: "One special character (!@#$ etc.)",
      valid: /[^A-Za-z0-9\s]/.test(password),
    },
    {
      label: "No spaces",
      valid: !/\s/.test(password),
    },
  ];

  const isPasswordValid = passwordChecks.every((check) => check.valid);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("Please meet all password requirements.");
      return;
    }

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      navigate("/login");
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
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
              Join BloodConnect
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Connect with people who need or can donate blood.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full name
                </label>

                <input
                  name="name"
                  placeholder="Your full name"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#b4232c] focus:ring-2 focus:ring-red-100"
                />
              </div>

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
                  Phone
                </label>

                <input
                  name="phone"
                  type="tel"
                  placeholder="Your phone number"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  minLength="8"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#b4232c] focus:ring-2 focus:ring-red-100"
                />

                <div className="mt-2 space-y-1">
                  {passwordChecks.map((check) => (
                    <p
                      key={check.label}
                      className={`text-sm ${
                        check.valid ? "text-green-600" : "text-slate-500"
                      }`}
                    >
                      <span className="mr-2">{check.valid ? "✓" : "○"}</span>
                      {check.label}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-[#b4232c]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-[#b4232c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#991b1b]"
            >
              Create Account
            </button>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-[#b4232c] hover:text-[#991b1b]"
              >
                Sign in
              </a>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Register;
