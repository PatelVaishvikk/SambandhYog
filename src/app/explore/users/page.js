import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME } from "@/lib/cookies";
import { verifyToken } from "@/lib/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import UsersDirectoryClient from "./UsersDirectoryClient";

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

export default async function ExploreUsersPage() {
  await requireCurrentUser();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <UsersDirectoryClient />
    </div>
  );
}
