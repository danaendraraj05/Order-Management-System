import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="p-4 bg-gray-200 flex justify-between">
      <div>
        <Link to="/" className="font-bold">your brand name</Link>
      </div>
      <div>
        {user ? (
          <>
            <span className="mr-4">Hello, {user.username}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};
