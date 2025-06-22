import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { isAuthenticated, login, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black to-gray-900 text-gray-100">
        <Link
          to="/"
          className="text-2xl font-extrabold text-red-500"
        >
          Song Vault
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to={isAuthenticated ? "/dashboard" : "#"}
            onClick={!isAuthenticated ? login : undefined}
            className="hover:text-red-400 transition"
          >
            {isAuthenticated ? "Dashboard" : "Get started"}
          </Link>
          {isAuthenticated && (
            <Link
              to="/songs/new"
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 text-white"
            >
              + New song
            </Link>
          )}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
            >
              Log out
            </button>
          ) : (
            <button
              onClick={login}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
              Log in
            </button>
          )}
        </div>

        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-4">
          <Link
            to={isAuthenticated ? "/dashboard" : "#"}
            onClick={() => {
              setMenuOpen(false);
              if (!isAuthenticated) login();
            }}
            className="block text-lg"
          >
            {isAuthenticated ? "Dashboard" : "Get started"}
          </Link>
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 bg-gray-800 rounded"
            >
              Log out
            </button>
          ) : (
            <button
              onClick={() => {
                login();
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 bg-blue-600 rounded"
            >
              Log in
            </button>
          )}
        </div>
      )}
    </>
  );
}
