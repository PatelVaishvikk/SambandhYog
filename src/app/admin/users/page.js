import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";

const USERS = [
  { id: "user_1", name: "Neha Kapoor", status: "Active", role: "Member" },
  { id: "user_2", name: "Kabir Joshi", status: "Pending review", role: "Mentor" },
];

export default function AdminUsersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-16">
        <h1 className="text-3xl font-semibold text-white">Community members</h1>
        <Card contentClassName="space-y-4">
          <table className="w-full text-left text-sm text-slate-300">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-2">Name</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {USERS.map((user) => (
                <tr key={user.id}>
                  <td className="py-3 text-white">{user.name}</td>
                  <td className="py-3">{user.role}</td>
                  <td className="py-3 text-brand-300">{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
}

