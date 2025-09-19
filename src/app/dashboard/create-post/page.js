import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import PostForm from "@/components/posts/PostForm";
import Card from "@/components/ui/Card";

export default function CreatePostPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 gap-6">
        <Sidebar />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
          <Card className="space-y-4">
            <h1 className="text-2xl font-semibold text-white">Share a new update</h1>
            <p className="text-sm text-slate-400">
              Highlight a milestone, gratitude moment, or request for support. Keep it constructive and positive.
            </p>
            <PostForm />
          </Card>
        </main>
      </div>
    </div>
  );
}
