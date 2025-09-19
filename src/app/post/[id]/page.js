import PostCard from "@/components/posts/PostCard";
import CommentSection from "@/components/posts/CommentSection";

const SAMPLE_POST = {
  id: "post_1",
  author: {
    name: "Neha Kapoor",
    role: "Growth PM",
    avatarUrl: "/default-avatar.png",
  },
  title: "Building a praise-powered culture",
  content: "We write Friday appreciations and it has transformed morale across the company.",
  tags: ["Leadership", "Culture"],
  likes: 128,
  comments: 12,
  createdAt: new Date().toISOString(),
};

export default function PostPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col gap-8 px-6 py-16">
      <PostCard post={SAMPLE_POST} />
      <CommentSection />
    </div>
  );
}
