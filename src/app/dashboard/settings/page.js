'use client';

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Card from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 gap-6">
        <Sidebar />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
          <Card className="space-y-4">
            <h1 className="text-2xl font-semibold text-white">Preferences</h1>
            <div className="space-y-2 text-sm text-slate-300">
              <label className="flex items-center gap-3">
                <input type="radio" name="theme" value="light" checked={theme === "light"} onChange={() => setTheme("light")} />
                Light theme
              </label>
              <label className="flex items-center gap-3">
                <input type="radio" name="theme" value="dark" checked={theme === "dark"} onChange={() => setTheme("dark")} />
                Dark theme
              </label>
              <label className="flex items-center gap-3">
                <input type="radio" name="theme" value="system" checked={theme === "system"} onChange={() => setTheme("system")} />
                Match system
              </label>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

