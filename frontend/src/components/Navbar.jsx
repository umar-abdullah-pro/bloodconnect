import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiDroplet,
  FiUser,
  FiUsers,
  FiClipboard,
  FiLogOut,
} from "react-icons/fi";
import { api } from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: FiHome },
    { name: "My Requests", path: "/blood-requests", icon: FiDroplet },
    { name: "Donor Profile", path: "/donor-profile", icon: FiUser },
    { name: "Contact Requests", path: "/contact-requests", icon: FiUsers },
    { name: "My Contacts", path: "/my-contacts", icon: FiClipboard },
  ];

  const handleLogout = async () => {
    try {
      await api("/auth/logout", { method: "POST" });
      navigate("/login");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        {/* Logo */}
        <NavLink to="/dashboard" className="shrink-0">
          <img
            src="/assets/logo.png"
            alt="BloodConnect"
            className="h-10 w-auto"
          />
        </NavLink>

        {/* Navigation */}
        <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-red-50 text-[#b4232c]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Sign out"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-[#991b1b] hover:bg-[#991b1b] hover:text-white"
        >
          <FiLogOut size={18} />
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
