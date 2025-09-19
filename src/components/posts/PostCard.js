import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import LikeButton from "@/components/posts/LikeButton";
import CommentSection from "@/components/posts/CommentSection";
import { formatRelativeTime } from "@/utils/formatters";

export default function PostCard({ post }) {
  if (!post) return null;
  return (
    <Card className="space-y-4" interactive>
      <header className="flex items-start gap-3">
        <Avatar src={post.author?.avatarUrl} alt={post.author?.name} size={52} />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-900">{post.author?.name}</span>
          <span className="text-xs text-slate-500">{post.author?.headline}</span>
        </div>
        <span className="ml-auto text-xs text-slate-400">{formatRelativeTime(post.createdAt)}</span>
      </header>
      <div className="space-y-3 text-sm text-slate-600">
        {post.title ? <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3> : null}
        <p className="leading-relaxed">{post.content}</p>
      </div>
      {post.tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag}>#{tag}</Badge>
          ))}
        </div>
      ) : null}
      <footer className="flex items-center gap-4 text-xs text-slate-400">
        <LikeButton initialCount={post.likes ?? 0} />
        <span>?? {post.comments?.length ?? 0} reflections</span>
      </footer>
      <CommentSection comments={post.comments ?? []} />
    </Card>
  );
}
