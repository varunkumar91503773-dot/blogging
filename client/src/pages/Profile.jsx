import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

export default function Profile() {
  const { user, setUser, loading } = useAuth();
  const [form, setForm] = useState({ name: '', bio: '', avatar: '' });
  const [posts, setPosts] = useState([]);
  const [saved, setSaved] = useState('');

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', bio: user.bio || '', avatar: user.avatar || '' });
      api.get(`/posts/user/${user._id}`).then((res) => setPosts(res.data));
    }
  }, [user]);

  if (loading) return <p className="py-16 text-center text-zinc-500">Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  const save = async (e) => {
    e.preventDefault();
    const { data } = await api.put('/users/profile/update', form);
    setUser(data);
    setSaved('Profile updated!');
    setTimeout(() => setSaved(''), 2000);
  };

  const input =
    'w-full rounded-xl border border-white/10 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30';

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-black tracking-tight">
        My{' '}
        <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          profile
        </span>
      </h1>
      <div className="mt-5 grid gap-6 md:grid-cols-[320px_1fr]">
        <form
          onSubmit={save}
          className="h-fit space-y-3 rounded-3xl border border-white/10 bg-zinc-900/70 p-5 shadow-2xl shadow-black/50"
        >
          <div className="flex items-center gap-3">
            {form.avatar ? (
              <img
                src={form.avatar}
                alt=""
                className="h-14 w-14 rounded-full object-cover ring-2 ring-violet-500/40"
              />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-xl font-bold text-white">
                {(form.name?.[0] || '?').toUpperCase()}
              </span>
            )}
            <div>
              <p className="font-bold text-zinc-100">{user.name}</p>
              <p className="text-xs text-zinc-500">{user.email}</p>
            </div>
          </div>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            className={input}
          />
          <input
            value={form.avatar}
            onChange={(e) => setForm({ ...form, avatar: e.target.value })}
            placeholder="Avatar URL"
            className={input}
          />
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Short bio..."
            rows={3}
            className={input}
          />
          <button className="w-full rounded-xl bg-white py-2 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200">
            Save profile
          </button>
          {saved && <p className="text-center text-sm text-green-400">{saved}</p>}
        </form>
        <div>
          <h2 className="font-bold text-zinc-100">My posts ({posts.length})</h2>
          {posts.length === 0 ? (
            <div className="mt-3 rounded-2xl border border-dashed border-white/10 bg-zinc-900/40 p-10 text-center">
              <p className="text-sm text-zinc-500">
                You haven&apos;t published anything yet.{' '}
                <Link to="/create" className="font-semibold text-violet-400 hover:text-violet-300">
                  Write your first post
                </Link>
              </p>
            </div>
          ) : (
            <div className="mt-3 grid gap-5 sm:grid-cols-2">
              {posts.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
