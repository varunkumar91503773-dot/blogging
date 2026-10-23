import { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function CommentSection({ postId, postAuthorId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/comments/post/${postId}`);
      setComments(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [postId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const { data } = await api.post(`/comments/post/${postId}`, { text });
    setComments((c) => [data, ...c]);
    setText('');
  };

  const remove = async (id) => {
    if (!confirm('Delete this comment?')) return;
    await api.delete(`/comments/${id}`);
    setComments((c) => c.filter((x) => x._id !== id));
  };

  return (
    <div className="mt-10">
      <h3 className="text-lg font-bold text-zinc-100">Comments ({comments.length})</h3>
      {user ? (
        <form onSubmit={submit} className="mt-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
          />
          <button className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-950 transition hover:from-violet-500 hover:to-indigo-500">
            Post
          </button>
        </form>
      ) : (
        <p className="mt-3 text-sm text-zinc-500">Login to join the discussion.</p>
      )}
      <div className="mt-4 space-y-3">
        {loading && <p className="text-sm text-zinc-500">Loading comments...</p>}
        {!loading && comments.length === 0 && (
          <p className="text-sm text-zinc-500">No comments yet. Be the first!</p>
        )}
        {comments.map((c) => (
          <div key={c._id} className="flex gap-3 rounded-2xl border border-white/10 bg-zinc-900/70 p-3">
            {c.author?.avatar ? (
              <img src={c.author.avatar} alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-white/20" />
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-bold text-white">
                {(c.author?.name?.[0] || '?').toUpperCase()}
              </span>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-200">{c.author?.name}</span>
                <span className="text-xs text-zinc-500">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-zinc-300">{c.text}</p>
              {(user && (String(user._id) === String(c.author?._id) || String(user._id) === String(postAuthorId))) && (
                <button onClick={() => remove(c._id)} className="mt-1 text-xs font-medium text-red-400 hover:text-red-300 hover:underline">
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
