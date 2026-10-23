import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-2xl font-black tracking-tight text-transparent">
          Inkwell
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
          >
            Home
          </Link>
          {user ? (
            <>
              <Link
                to="/create"
                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-950 transition hover:from-violet-500 hover:to-indigo-500"
              >
                + New Post
              </Link>
              <Link
                to="/profile"
                className="hidden items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-white/5 sm:flex"
              >
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    user.name[0].toUpperCase()
                  )}
                </span>
                <span className="max-w-[100px] truncate text-sm font-medium text-zinc-200">
                  {user.name}
                </span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
