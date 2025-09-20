import PostCard from "@/components/posts/PostCard";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import { usePosts } from "@/context/PostsContext";

export default function PostList() {
  const { posts, isLoading, error, fetchPosts, currentUser } = usePosts();

  const handleRetry = () => {
    if (isLoading) return;
    fetchPosts?.();
  };

  if (isLoading && !posts.length) {
    return (
      <Card contentClassName="flex items-center gap-3 text-sm text-slate-300">
        <Spinner />
        <span>Gathering uplifting stories...</span>
      </Card>
    );
  }

  if (error) {
    return (
      <Card contentClassName="space-y-3 text-sm text-rose-200">
        <p>Could not load posts: {error}</p>
        <Button size="sm" variant="secondary" onClick={handleRetry} disabled={isLoading}>
          Try again
        </Button>
      </Card>
    );
  }

  if (!posts.length) {
    return (
      <Card contentClassName="text-center text-sm text-slate-300">
        <div className="space-y-3">
          <p className="text-base font-semibold text-white">No posts yet</p>
          <p className="text-sm text-slate-400">
            Share your first light-filled achievement to inspire the community.
          </p>
          <Button size="sm" variant="secondary" onClick={() => fetchPosts?.()}>Refresh feed</Button>
        </div>
      </Card>
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




