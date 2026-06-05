import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import { ResultRanking } from "@/components/result-ranking";
import { VoteSummaryTable } from "@/components/vote-summary-table";
import { getMeetingResults } from "@/lib/results";

type PageProps = {
  params: Promise<{ code: string }>;
};

export default async function ResultsPage({ params }: PageProps) {
  const { code } = await params;
  const results = await getMeetingResults(code);

  if (!results) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-8">
      <nav className="flex flex-wrap items-center justify-between gap-3">
        <Link href={`/m/${results.code}`} className="focus-ring inline-flex items-center gap-2 rounded-md px-1 py-2 text-sm text-ink/70 hover:text-ink">
          <ArrowLeft size={16} aria-hidden />
          투표 화면
        </Link>
        <div className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm text-ink/70">
          <CalendarCheck size={16} aria-hidden />
          참여 코드 {results.code}
        </div>
      </nav>

      <section className="mt-8">
        <h1 className="text-3xl font-bold tracking-normal text-ink">{results.title}</h1>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-line bg-white p-4">
            <p className="text-sm text-ink/60">예상 인원</p>
            <p className="mt-1 text-2xl font-bold">{results.expectedCount}명</p>
          </div>
          <div className="rounded-lg border border-line bg-white p-4">
            <p className="text-sm text-ink/60">투표 완료</p>
            <p className="mt-1 text-2xl font-bold">{results.votedCount}명</p>
          </div>
          <div className="rounded-lg border border-line bg-white p-4">
            <p className="text-sm text-ink/60">아직 미투표</p>
            <p className="mt-1 text-2xl font-bold">{results.notVotedCount}명</p>
          </div>
        </div>
      </section>

      <ResultRanking topDates={results.topDates} />
      <VoteSummaryTable rows={results.dateRows} />
    </main>
  );
}
