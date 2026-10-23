import { useEffect, useState } from 'react';
import api from '../api/api';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/posts', { params: { page, limit: 9, search: q } });
        setPosts(data.posts);
        setTotal(data.total);
        setPages(data.pages);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 p-8 sm:p-12">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-400">
            {total} stories published
          </p>
          <h1 className="mt-2 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Ideas in{' '}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              ink black
            </span>
            .
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Read, write and discuss stories from developers and creators. Publish your first post in
            under a minute.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setQ(search);
            }}
            className="mt-6 flex w-full max-w-md gap-2"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts, tags..."
              className="flex-1 rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
            />
            <button className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950 transition hover:from-violet-500 hover:to-indigo-500">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Feed */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-100">
          {q ? `Results for "${q}"` : 'Latest stories'}
        </h2>
        {q && (
          <button
            onClick={() => {
              setQ('');
              setSearch('');
              setPage(1);
            }}
            className="text-xs font-medium text-violet-400 hover:text-violet-300 hover:underline"
          >
            Clear search
          </button>
        )}
      </div>

      {loading ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl border border-white/5 bg-zinc-900/60" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-zinc-900/40 p-12 text-center">
          <p className="text-zinc-300 font-semibold">No posts found.</p>
          <p className="mt-1 text-sm text-zinc-500">Try a different search, or be the first to write.</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p._id} post={p} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-zinc-500">
            Page {page} of {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
