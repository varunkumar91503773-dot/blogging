import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';

const empty = { title: '', content: '', excerpt: '', coverImage: '', tags: '' };

export default function PostForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/posts/${id}`).then((res) => {
        const p = res.data;
        setForm({
          title: p.title || '',
          content: p.content || '',
          excerpt: p.excerpt || '',
          coverImage: p.coverImage || '',
          tags: (p.tags || []).join(', '),
        });
      });
    }
  }, [id, isEdit]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      const { data } = isEdit
        ? await api.put(`/posts/${id}`, payload)
        : await api.post('/posts', payload);
      navigate(`/posts/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setBusy(false);
    }
  };

  const input =
    'w-full rounded-xl border border-white/10 bg-zinc-950/70 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30';

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-black tracking-tight">
        {isEdit ? 'Edit ' : 'Write a new '}
        <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          post
        </span>
      </h1>
      <form
        onSubmit={submit}
        className="mt-5 space-y-3 rounded-3xl border border-white/10 bg-zinc-900/70 p-6 shadow-2xl shadow-black/50"
      >
        {error && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
        <input
          required
          placeholder="Post title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={`${input} text-base font-semibold`}
        />
        <input
          placeholder="Cover image URL (optional)"
          value={form.coverImage}
          onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          className={input}
        />
        {form.coverImage && (
          <img
            src={form.coverImage}
            alt=""
            onError={(e) => (e.currentTarget.style.display = 'none')}
            onLoad={(e) => (e.currentTarget.style.display = '')}
            className="h-44 w-full rounded-xl border border-white/10 object-cover"
          />
        )}
        <input
          placeholder="Tags (comma separated, e.g. react, javascript)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className={input}
        />
        <input
          placeholder="Short excerpt (optional)"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className={input}
        />
        <textarea
          required
          rows={12}
          placeholder="Write your story..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className={`${input} leading-relaxed`}
        />
        <button
          disabled={busy}
          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950 transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50"
        >
          {busy ? 'Saving...' : isEdit ? 'Save changes' : 'Publish post'}
        </button>
      </form>
    </div>
  );
}
