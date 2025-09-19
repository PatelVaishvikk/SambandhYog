import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export default function ProfileCard({ profile }) {
  if (!profile) return null;
  return (
    <Card className="flex flex-col items-center gap-4 text-center">
      <Avatar src={profile.avatarUrl} alt={profile.name} size={80} />
      <div>
        <h2 className="text-xl font-semibold text-white">{profile.name}</h2>
        <p className="text-sm text-slate-400">{profile.headline}</p>
      </div>
      {profile.tags?.length ? <Badge>{profile.tags[0]}</Badge> : null}
    </Card>
  );
}
