import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { btnPrimaryClass, pillClass } from '../utils/styles.js';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const { login, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900 text-white md:grid-cols-2">
      <section className="flex flex-col justify-center gap-6 p-12">
        <span className={pillClass}>Shopify intelligence</span>
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">Turn every storefront signal into an insight.</h1>
        <p className="max-w-sm text-white/80">
          Monitor revenue, orders, customer journeys, and abandoned carts in a single command center.
          Real-time ingestion keeps leadership dashboards a step ahead.
        </p>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-4xl font-bold">27%</p>
            <small className="text-white/70">Faster sync cycles</small>
          </div>
          <div>
            <p className="text-4xl font-bold">+8.5k</p>
            <small className="text-white/70">Orders monitored</small>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6 rounded-[32px] bg-white p-12 text-slate-900 shadow-2xl md:rounded-none md:rounded-l-[48px]">
        <div>
          <span className={`${pillClass} bg-indigo-100/80 text-indigo-600`}>Admin access</span>
          <h1 className="mt-3 text-3xl font-bold">Xeno Insights Portal</h1>
          <p className="text-slate-500">Sign in with your dashboard email to access tenant analytics.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Email
            <input
              required
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@store.com"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none ring-indigo-200 transition focus:ring-4"
            />
          </label>

          <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Password
            <input
              required
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none ring-indigo-200 transition focus:ring-4"
            />
          </label>

          {error && (
            <p className="text-sm font-semibold text-rose-500">{error}</p>
          )}

          <button type="submit" disabled={authLoading} className={`${btnPrimaryClass} w-full`}>
            {authLoading ? 'Connecting...' : 'Enter dashboard'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;
