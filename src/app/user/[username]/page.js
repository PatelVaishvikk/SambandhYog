import UserProfileClient from "./UserProfileClient";

export default async function UserProfilePage({ params }) {
  const resolvedParams = await params;
  const username = typeof resolvedParams?.username === "string" ? resolvedParams.username : "";

  return <UserProfileClient username={username} />;
}
