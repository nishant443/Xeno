import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-6">
        <div>
          <Link to="/" className="text-lg font-semibold text-slate-900">
            Xeno Dashboard
          </Link>
          {user?.shopDomain && (
            <p className="text-sm text-slate-500">Connected store: {user.shopDomain}</p>
          )}
        </div>
        <button
          onClick={logout}
          className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-rose-200 transition hover:-translate-y-0.5"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
