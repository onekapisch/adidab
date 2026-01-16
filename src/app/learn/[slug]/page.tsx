import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lessons } from "@/lib/lessons";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const lesson = lessons.find((item) => item.slug === params.slug);
  if (!lesson) {
    return {
      title: "Lesson - adidab",
      description: "Bitcoin learning lesson.",
    };
  }
  return {
    title: `${lesson.title} - adidab`,
    description: lesson.summary,
  };
}

export default function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = lessons.find((item) => item.slug === params.slug);
  if (!lesson) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-6 pb-20 pt-16 sm:px-8 lg:px-12">
      <div className="space-y-6">
        <Link
          href="/learn"
          className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white/30 hover:text-white"
        >
          Back to Learn
        </Link>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          {lesson.title}
        </h1>
        <p className="max-w-2xl text-base text-white/60">{lesson.summary}</p>
      </div>

      <section className="glass-card p-8 gold-glow">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          TLDR
        </p>
        <ul className="mt-4 space-y-2 text-sm text-white/70">
          {lesson.tldr.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-6">
        {lesson.sections.map((section) => (
          <div key={section.title} className="soft-card p-6 gold-border">
            <h2 className="text-2xl font-semibold text-white">
              {section.title}
            </h2>
            <p className="mt-3 text-sm text-white/60">{section.body}</p>
          </div>
        ))}
      </section>

      <section className="soft-card p-6 gold-border">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Next step
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Link
            href="/tools"
            className="inline-flex rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black shadow-premium transition hover:opacity-90"
          >
            Open Tools
          </Link>
          <Link
            href="/learn/whitepaper"
            className="inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white/30 hover:text-white"
          >
            Read the Whitepaper TLDR
          </Link>
        </div>
      </section>
    </div>
  );
}
