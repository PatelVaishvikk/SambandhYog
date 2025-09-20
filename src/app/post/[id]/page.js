import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PostCard from "@/components/posts/PostCard";
import Card from "@/components/ui/Card";
import { SESSION_COOKIE_NAME } from "@/lib/cookies";
import { verifyToken } from "@/lib/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { ensurePostVisibility, serializePost } from "@/lib/posts";

async function requireCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) redirect("/auth/login");

  const payload = verifyToken(token);
  if (!payload?.sub) redirect("/auth/login");

  await connectToDatabase();
  const currentUser = await User.findById(payload.sub);
  if (!currentUser) redirect("/auth/login");
  return currentUser;
}

export default async function PostPage({ params }) {
  const user = await requireCurrentUser();
  const { id } = params;

  await connectToDatabase();

  const post = await Post.findById(id)
    .populate({ path: "author", select: "name username headline avatarUrl" })
    .populate({ path: "comments.author", select: "name username headline avatarUrl" });

  if (!post) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-6 py-16">
        <Card contentClassName="text-sm text-slate-200">Post not found.</Card>
      </div>
    );
  }

  const canView = await ensurePostVisibility({ viewerId: user._id, authorId: post.author?._id ?? post.author });
  if (!canView) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-6 py-16">
        <Card contentClassName="text-sm text-slate-200">Follow this member to view their posts.</Card>
      </div>
    );
  }

  const serialized = serializePost(post, user._id);

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col gap-6 px-6 py-16">
      <PostCard post={serialized} />\n    </div>
  );
}

