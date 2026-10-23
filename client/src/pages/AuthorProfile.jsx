import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import PostCard from '../components/PostCard';

export default function AuthorProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/users/${id}`).then((res) => setData(res.data));
  }, [id]);

  if (!data) return <p className="py-16 text-center text-zinc-500">Loading...</p>;
  const { user, stats, posts } = data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="relative flex flex-col items-start gap-4 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 p-6 shadow-2xl shadow-black/50 sm:flex-row sm:items-center">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="relative rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 p-1">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-950 text-3xl font-bold text-white">
              {(user.name?.[0] || '?').toUpperCase()}
            </span>
          )}
        </div>
        <div className="relative">
          <h1 className="text-2xl font-black tracking-tight text-zinc-100">{user.name}</h1>
          <p className="mt-1 text-sm text-zinc-400">{user.bio || 'No bio yet.'}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-white/10 bg-zinc-950/70 px-2.5 py-1 font-semibold text-zinc-300">
              {stats.postCount} posts
            </span>
            <span className="rounded-full border border-white/10 bg-zinc-950/70 px-2.5 py-1 font-semibold text-zinc-300">
              {stats.totalLikes} total likes
            </span>
            <span className="rounded-full border border-white/10 bg-zinc-950/70 px-2.5 py-1 text-zinc-500">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <h2 className="mt-8 font-bold text-zinc-100">Posts by {user.name}</h2>
      {posts.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500">No posts yet.</p>
      ) : (
        <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p._id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
