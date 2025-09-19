import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BriefcaseBusiness,
  ShieldCheck,
  Handshake,
  Trophy,
  Users,
  BookOpen,
  MessageCircleHeart,
} from "lucide-react";

const featureHighlights = [
  {
    title: "Curated professional feed",
    description: "Follow categories that matter: career growth, leadership, mentorship, certifications, and more.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Positive-first community",
    description: "Automatic sentiment and language filtering keeps conversations respectful and uplifting.",
    icon: ShieldCheck,
  },
  {
    title: "Guided mentorship",
    description: "Find mentors, celebrate milestones, and receive feedback that accelerates your journey.",
    icon: Handshake,
  },
  {
    title: "Celebrate every win",
    description: "From first jobs to funding rounds—share the moments that matter with people who cheer for you.",
    icon: Trophy,
  },
];

const roadmap = [
  {
    title: "Verified identities",
    description: "Trust badges and context-rich profiles put skills and impact front and centre.",
    icon: Users,
  },
  {
    title: "Learning cohorts",
    description: "Guided paths with mentors, resources, and peers to master the next big skill.",
    icon: BookOpen,
  },
  {
    title: "Impact insights",
    description: "Understand how your contributions uplift others through positive engagement analytics.",
    icon: MessageCircleHeart,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-white shadow-inner">
              <Image src="/logo1.png" alt="SambandhYog" fill sizes="40px" className="object-contain p-1.5" priority />
            </span>
            SambandhYog
          </Link>
          <nav className="flex w-full flex-wrap items-center justify-end gap-4 text-sm text-slate-500 md:w-auto">
            <Link href="/auth/login" className="transition hover:text-emerald-600">
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
            >
              Join now
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16">
        <section className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Positive careers start here
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Grow with a community that celebrates every step of your professional journey
            </h1>
            <p className="text-base text-slate-500">
              Share milestones, discover mentors, and join supportive conversations built around compassion, growth, and purpose.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
              >
                Explore the feed
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="#features"
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600"
              >
                See what&apos;s inside
              </Link>
            </div>
          </div>
          <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Focused categories</p>
              <p className="text-sm text-slate-500">25+ topics to help you grow intentionally</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-400">Early members</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">4,800+</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-400">Weekly circles</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">120</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              "The platform radiates encouragement. It&apos;s where progress feels seen and supported." — Community member
            </p>
          </div>
        </section>

        <section id="features" className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Everything you need for purposeful networking</h2>
            <p className="text-sm text-slate-500">Tools and rituals that keep conversations kind, constructive, and actionable.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {featureHighlights.map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">A feed designed around your ambitions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Career Launchpad",
                description: "Break into new industries with curated resources, success stories, and real advice.",
              },
              {
                title: "Skill Builders",
                description: "Level up with live discussions, learning cohorts, and certification spotlights.",
              },
              {
                title: "Leaders & Mentors",
                description: "Tap into wisdom from leaders who share playbooks for growth and resilience.",
              },
              {
                title: "Community Wins",
                description: "Celebrate promotions, launches, speaking gigs, and the milestones that make careers.",
              },
            ].map((tile) => (
              <div key={tile.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">{tile.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{tile.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Inside the SambandhYog feed</h2>
            <p className="mt-2 text-sm text-slate-500">
              A daily rhythm of encouragement, reflection, and shared wisdom.
            </p>
            <div className="mt-6 space-y-4">
              {[
                {
                  title: "From break-in to breakthrough",
                  description:
                    "How I landed a product role without prior experience—sharing artifacts, mentors, and my learning playlist.",
                  tags: ["Career pivot", "UX Research"],
                },
                {
                  title: "Weekly wins from the growth circle",
                  description: "15 community shout-outs covering certifications, promotions, and team appreciations.",
                  tags: ["Community", "Motivation"],
                },
                {
                  title: "Live AMA: Designing accessible fintech",
                  description: "Senior designers from leading startups answer questions, share frameworks, and review portfolios.",
                  tags: ["Mentorship", "Product"],
                },
              ].map((post) => (
                <article key={post.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-base font-semibold text-slate-900">{post.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{post.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-emerald-600">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Voices from the circle</h3>
            <ul className="mt-4 space-y-5 text-sm text-slate-600">
              {[
                {
                  quote:
                    "SambandhYog helped me turn mentorship into a weekly habit. The positivity keeps me accountable.",
                  author: "Ishita Mehta",
                  role: "Product Designer, Mumbai",
                },
                {
                  quote: "We found advisors through community AMAs—the tone stays encouraging even when feedback is candid.",
                  author: "Rahul Shah",
                  role: "Founder, Bengaluru",
                },
              ].map((testimonial) => (
                <li key={testimonial.author} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="italic">“{testimonial.quote}”</p>
                  <p className="mt-3 text-xs font-semibold text-slate-700">{testimonial.author}</p>
                  <p className="text-xs text-slate-400">{testimonial.role}</p>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section id="roadmap" className="space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Built for today, evolving for tomorrow</h2>
              <p className="text-sm text-slate-500">Features on the horizon to keep your growth meaningful and sustainable.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Upcoming releases
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {roadmap.map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-base font-semibold text-slate-900">Ready to build a kinder professional network?</p>
            <p className="mt-1 text-sm text-slate-500">
              Join founders, students, and leaders who share knowledge freely and celebrate progress every week.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
            >
              Create your profile
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/auth/login"
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600"
            >
              I already have an account
            </Link>
          </div>
        </div>
        <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
          Copyright {new Date().getFullYear()} SambandhYog. Designed with empathy, powered by community.
        </div>
      </footer>
    </div>
  );
}
