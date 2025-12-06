import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { btnPrimaryClass, pillClass } from '../utils/styles.js';

const Signup = () => {
  const [form, setForm] = useState({ name: '', shopDomain: '', accessToken: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      setLoading(true);
      // create tenant
      await api.post('/tenants', {
        name: form.name,
        shopDomain: form.shopDomain,
        accessToken: form.accessToken,
        adminEmail: form.email,
        adminPassword: form.password
      });

      // after signup navigate to login
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 text-slate-900 shadow-2xl">
        <div className="mb-6">
          <span className={`${pillClass} bg-indigo-100/80 text-indigo-600`}>Create account</span>
          <h1 className="mt-3 text-2xl font-bold">Sign up your store</h1>
          <p className="text-sm text-slate-500">Enter your store details and admin credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="col-span-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Store name
            <input name="name" value={form.name} onChange={handleChange} required className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </label>

          <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Shop domain
            <input name="shopDomain" value={form.shopDomain} onChange={handleChange} required placeholder="your-store.myshopify.com" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </label>

          <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Access token
            <input name="accessToken" value={form.accessToken} onChange={handleChange} required placeholder="shpat_..." className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </label>

          <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Admin email
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </label>

          <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Admin password
            <input name="password" type="password" value={form.password} onChange={handleChange} required className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </label>

          {error && <p className="col-span-2 text-sm font-semibold text-rose-500">{error}</p>}

          <div className="col-span-2 flex justify-end">
            <button className={`${btnPrimaryClass} w-full sm:w-auto`} type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
