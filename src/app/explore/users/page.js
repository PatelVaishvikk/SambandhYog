import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import { SESSION_COOKIE_NAME } from "@/lib/cookies";
import { verifyToken } from "@/lib/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { fetchUsers } from "@/lib/api";
import UsersSearch from "./UsersSearch";

function formatCount(value) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value ?? 0);
}

export const dynamic = "force-dynamic";

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

export default async function ExploreUsersPage({ searchParams }) {
  await requireCurrentUser();

  const params = await Promise.resolve(searchParams);
  const searchTerm = typeof params?.q === "string" ? params.q : "";
  const users = await fetchUsers({ search: searchTerm, limit: 40 });

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col gap-6 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-slate-900">Members building positive careers</h1>
        <p className="text-sm text-slate-500">Follow mentors, collaborators, and learning buddies across SambandhYog.</p>
      </div>

      <UsersSearch initialValue={searchTerm} />

      {searchTerm ? (
        <p className="text-xs uppercase tracking-wide text-slate-400">Showing results for "{searchTerm}"</p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {users.map((user) => (
          <Card key={user.id} className="flex flex-col gap-4 p-5">
            <div className="flex items-center gap-3">
              <Avatar src={user.avatarUrl} alt={user.name} size={48} />
              <div>
                <p className="text-lg font-semibold text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-500">{user.headline || "Member of SambandhYog"}</p>
                {user.location ? <p className="text-xs text-slate-400">{user.location}</p> : null}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{formatCount(user.followers)} followers</span>
              <span>@{user.username}</span>
            </div>
            <Link
              href={`/user/${user.username}`}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-600 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              View profile
            </Link>
          </Card>
        ))}
        {!users.length ? (
          <Card className="text-sm text-slate-500">No members found. Try a different search.</Card>
        ) : null}
      </div>
    </div>
  );
}
