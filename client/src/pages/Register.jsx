import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getErrorMessage(err, fallback) {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.data?.errors?.length)
    return err.response.data.errors.map((e) => e.msg).join(', ');
  if (err.code === 'ERR_NETWORK' || err.message === 'Network Error')
    return 'Cannot reach the server. Is the backend running on http://localhost:5000? (cd server && npm run dev)';
  return fallback;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed'));
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
          Join{' '}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Inkwell
          </span>
        </h1>
        <p className="mt-1 text-center text-sm text-zinc-500">Create your account to start writing.</p>
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
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={input}
          />
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
            minLength={6}
            placeholder="Password (min 6 chars)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={input}
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-white py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
          >
            {busy ? 'Creating account...' : 'Sign up'}
          </button>
          <p className="text-center text-sm text-zinc-500">
            Have an account?{' '}
            <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-300">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
