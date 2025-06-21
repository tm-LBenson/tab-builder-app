import { Link } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
export default function Header() {
  const { isAuthenticated, login } = useAuth();

  return (
    <header className="flex-grow flex flex-col items-center justify-center text-center px-6">
      <h1
        className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight text-red-500"
        style={{
          textShadow: "0 0 4px rgba(255,0,0,.7),0 0 8px rgba(255,0,0,.5)",
        }}
      >
        Your Guitar Tabs
        <br className="hidden md:inline" />
        Anywhere
      </h1>
      <p className="max-w-xl text-gray-300 mb-8">
        Store, edit, and share chord sheets in a lightning fast rock themed
        interface
      </p>
      {isAuthenticated ? (
        <Link
          to="/dashboard"
          className="inline-block px-8 py-4 bg-red-600 rounded-full text-white text-lg hover:bg-red-500 transition"
        >
          Open dashboard
        </Link>
      ) : (
        <button
          onClick={login}
          className="inline-block px-8 py-4 bg-red-600 rounded-full text-white text-lg hover:bg-red-500 transition"
        >
          Get started
        </button>
      )}
    </header>
  );
}
