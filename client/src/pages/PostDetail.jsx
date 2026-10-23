import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    api.get(`/posts/${id}`).then((res) => {
      setPost(res.data);
      if (user) setLiked(res.data.likes?.includes(user._id));
    });
    // eslint-disable-next-line
  }, [id]);

  if (!post)
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="h-8 w-2/3 animate-pulse rounded-lg bg-zinc-800" />
        <div className="mt-4 h-72 animate-pulse rounded-2xl bg-zinc-900" />
        <div className="mt-4 space-y-2">
          <div className="h-4 animate-pulse rounded bg-zinc-800" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-800" />
        </div>
      </div>
    );

  const isOwner = user && String(user._id) === String(post.author?._id);

  const toggleLike = async () => {
    if (!user) return navigate('/login');
    const { data } = await api.put(`/posts/${id}/like`);
    setLiked(data.liked);
    setPost({ ...post, likeCount: data.likeCount });
  };

  const remove = async () => {
    if (!confirm('Delete this post?')) return;
    await api.delete(`/posts/${id}`);
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {post.coverImage && (
        <div className="overflow-hidden rounded-3xl border border-white/10">
          <img src={post.coverImage} alt="" className="h-72 w-full object-cover" />
        </div>
      )}
      <div className="mt-5 flex flex-wrap gap-1.5">
        {(post.tags || []).map((t) => (
          <span
            key={t}
            className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-300"
          >
            #{t}
          </span>
        ))}
      </div>
      <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
        {post.title}
      </h1>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-zinc-900/60 p-3">
        <Link to={`/authors/${post.author?._id}`} className="flex items-center gap-2.5">
          {post.author?.avatar ? (
            <img
              src={post.author.avatar}
              alt=""
              className="h-10 w-10 rounded-full object-cover ring-2 ring-violet-500/40"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white">
              {(post.author?.name?.[0] || '?').toUpperCase()}
            </span>
          )}
          <span>
            <span className="block text-sm font-semibold text-zinc-100 hover:text-violet-300 hover:underline">
              {post.author?.name}
            </span>
            <span className="block text-xs text-zinc-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLike}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              liked
                ? 'border-red-500/30 bg-red-500/10 text-red-400 shadow-lg shadow-red-950'
                : 'border-white/10 text-zinc-300 hover:bg-white/5'
            }`}
          >
            {liked ? '❤' : '🤍'} {post.likeCount ?? 0}
          </button>
          {isOwner && (
            <>
              <Link
                to={`/edit/${post._id}`}
                className="rounded-full border border-white/10 px-4 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5"
              >
                Edit
              </Link>
              <button
                onClick={remove}
                className="rounded-full border border-red-500/30 px-4 py-1.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      <p className="mt-6 whitespace-pre-wrap text-[1.05rem] leading-relaxed text-zinc-300">
        {post.content}
      </p>
      <CommentSection postId={post._id} postAuthorId={post.author?._id} />
    </div>
  );
}
