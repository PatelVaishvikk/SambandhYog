import PostCard from "@/components/posts/PostCard";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import { usePosts } from "@/context/PostsContext";

export default function PostList() {
  const { posts, isLoading, error, fetchPosts } = usePosts();

  const handleRetry = () => {
    if (isLoading) return;
    fetchPosts?.();
  };

  if (isLoading && !posts.length) {
    return (
      <Card className="flex items-center gap-3 text-sm text-ink-400">
        <Spinner />
        <span>Gathering uplifting stories...</span>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="space-y-3 text-sm text-lotus-600">
        <p>Could not load posts: {error}</p>
        <Button size="sm" variant="secondary" onClick={handleRetry} disabled={isLoading}>
          Try again
        </Button>
      </Card>
    );
  }

  if (!posts.length) {
    return (
      <div className="rounded-fluid border border-dashed border-ink-200 bg-white/80 p-10 text-center text-sm text-ink-400">
        No posts yet. Share your first light-filled achievement!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
