import { Link } from 'react-router-dom';

export function avatarLetter(name = '?') {
  return (name[0] || '?').toUpperCase();
}

export default function PostCard({ post }) {
  const author = post.author || {};
  return (
    <Link
      to={`/posts/${post._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/70 transition duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-950/40"
    >
      {post.coverImage && (
        <div className="overflow-hidden">
          <img
            src={post.coverImage}
            alt=""
            loading="lazy"
            className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {(post.tags || []).slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-xs font-medium text-violet-300"
            >
              #{t}
            </span>
          ))}
        </div>
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-zinc-100 transition group-hover:text-violet-300">
          {post.title}
        </h3>
        <p className="line-clamp-2 mt-1 text-sm leading-relaxed text-zinc-400">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-sm">
          <span className="flex items-center gap-2">
            {author.avatar ? (
              <img src={author.avatar} alt="" className="h-7 w-7 rounded-full object-cover ring-1 ring-white/20" />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-bold text-white">
                {avatarLetter(author.name)}
              </span>
            )}
            <span className="font-medium text-zinc-300">{author.name || 'Unknown'}</span>
          </span>
          <span className="text-xs text-zinc-500">
            ❤ {post.likeCount ?? 0} · 💬 {post.commentCount ?? 0}
          </span>
        </div>
      </div>
    </Link>
  );
}
