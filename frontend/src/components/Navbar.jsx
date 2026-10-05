import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiDroplet,
  FiUser,
  FiUsers,
  FiClipboard,
  FiLogOut,
  FiSend,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { api } from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: FiHome },
    {
      name: "My Requests",
      path: "/blood-requests",
      icon: FiDroplet,
      match: ["/blood-requests", "/blood-request"],
    },
    { name: "Donor Profile", path: "/donor-profile", icon: FiUser },
    { name: "Contact Requests", path: "/contact-requests", icon: FiUsers },
    { name: "My Contacts", path: "/my-contacts", icon: FiClipboard },
    {
      name: "Sent Contact Requests",
      path: "/sent-contact-requests",
      icon: FiSend,
    },
  ];

  const handleLogout = async () => {
    try {
      await api("/auth/logout", { method: "POST" });
      navigate("/login");
    } catch (error) {
      console.error(error.message);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <nav className="mx-auto max-w-7xl px-5 py-3">
        {/* Desktop */}
        <div className="hidden items-center justify-between lg:flex">
          <NavLink to="/dashboard" className="shrink-0">
            <img
              src="/assets/logo.png"
              alt="BloodConnect"
              className="h-10 w-auto"
            />
          </NavLink>

          <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => {
                    const active =
                      isActive ||
                      link.match?.some((path) =>
                        location.pathname.startsWith(path),
                      );

                    return `flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium transition ${
                      active
                        ? "bg-red-50 text-[#b4232c]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`;
                  }}
                >
                  <Icon size={18} />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </div>

          <button
            onClick={handleLogout}
            title="Sign out"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-[#991b1b] hover:bg-[#991b1b] hover:text-white"
          >
            <FiLogOut size={18} />
          </button>
        </div>

        {/* Mobile */}
        <div className="flex items-center justify-between lg:hidden">
          <NavLink to="/dashboard" onClick={closeMenu}>
            <img
              src="/assets/logo.png"
              alt="BloodConnect"
              className="h-9 w-auto"
            />
          </NavLink>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:hidden">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={({ isActive }) => {
                    const active =
                      isActive ||
                      link.match?.some((path) =>
                        location.pathname.startsWith(path),
                      );

                    return `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-red-50 text-[#b4232c]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`;
                  }}
                >
                  <Icon size={18} />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}

            <div className="my-2 border-t border-slate-100" />

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-[#b4232c]"
            >
              <FiLogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
