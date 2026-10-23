import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form.email.trim(), form.password);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.message) setError(err.response.data.message);
      else if (err.response?.data?.errors?.length)
        setError(err.response.data.errors.map((x) => x.msg).join(', '));
      else if (err.code === 'ERR_NETWORK' || err.message === 'Network Error')
        setError('Cannot reach the server. Is the backend running on http://localhost:5000?');
      else setError('Login failed');
    } finally {
      setBusy(false);
    }
  };

  const input =
    'w-full rounded-xl border border-white/10 bg-zinc-950/70 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30';

  return (
    <div className="relative mx-auto max-w-md px-4 py-14">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="relative">
        <h1 className="text-center text-3xl font-black tracking-tight">
          Welcome{' '}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            back
          </span>
        </h1>
        <p className="mt-1 text-center text-sm text-zinc-500">Login to keep writing.</p>
        <form
          onSubmit={submit}
          className="mt-6 space-y-3 rounded-3xl border border-white/10 bg-zinc-900/70 p-6 shadow-2xl shadow-black/50 backdrop-blur"
        >
          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={input}
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={input}
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950 transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50"
          >
            {busy ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-center text-sm text-zinc-500">
            No account?{' '}
            <Link to="/register" className="font-semibold text-violet-400 hover:text-violet-300">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
