import PostCard from "@/components/posts/PostCard";
import Card from "@/components/ui/Card";

const SAMPLE_POST = {
  id: "post_user_1",
  author: {
    name: "Community Member",
    role: "Mentor",
    avatarUrl: "/default-avatar.png",
  },
  title: "First milestone",
  content: "Celebrating small wins as I mentor new members through their first leadership projects.",
  tags: ["Mentorship"],
  likes: 42,
  comments: 3,
  createdAt: new Date().toISOString(),
};

export default function UserPostsPage({ params }) {
  const { username } = params;

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold text-white">Posts by {username}</h1>
      <PostCard post={SAMPLE_POST} />
      <Card className="text-sm text-slate-300">More posts coming soon.</Card>
    </div>
  );
}
