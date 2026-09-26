import { useEffect, useState } from "react";
import { api } from "../services/api";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api("/auth/me")
      .then((data) => setUser(data.user))
      .catch((error) => console.error(error.message));
  }, []);

  const handleLogout = async () => {
    try {
      await api("/auth/logout", {
        method: "POST",
      });

      window.location.href = "/login";
    } catch (error) {
      console.error(error.message);
    }
  };

  if (!user) {
    return (
      <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Welcome */}
        <section className="mb-8">
          <p className="mb-2 text-sm font-medium text-[#b4232c]">
            BloodConnect
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Welcome, {user.name}
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your blood requests, donor profile and connections.
          </p>
        </section>

        {/* User Overview */}
        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-2 font-medium text-slate-900">{user.email}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Phone</p>
            <p className="mt-2 font-medium text-slate-900">{user.phone}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Account Role</p>
            <p className="mt-2 font-medium text-slate-900">{user.role}</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">
            Quick actions
          </h2>

          <div className="mt-4 grid gap-5 md:grid-cols-3">
            <a
              href="/blood-request/create"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-900">
                Create Blood Request
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Request blood and find compatible donors nearby.
              </p>

              <span className="mt-5 inline-block text-sm font-medium text-[#b4232c]">
                Create request →
              </span>
            </a>

            <a
              href="/blood-requests"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-900">My Requests</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                View and manage your active blood requests.
              </p>

              <span className="mt-5 inline-block text-sm font-medium text-[#b4232c]">
                View requests →
              </span>
            </a>

            <a
              href="/donor-profile"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-900">Donor Profile</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Manage your donor information and availability.
              </p>

              <span className="mt-5 inline-block text-sm font-medium text-[#b4232c]">
                View profile →
              </span>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
