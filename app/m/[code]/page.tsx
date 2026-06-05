import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { AvailabilityCalendar } from "@/components/availability-calendar";
import { getMeetingByCode } from "@/lib/meetings";
import { formatKoreanDate } from "@/lib/date";

type PageProps = {
  params: Promise<{ code: string }>;
};

export default async function MeetingVotePage({ params }: PageProps) {
  const { code } = await params;
  const meeting = await getMeetingByCode(code);

  if (!meeting) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-8">
      <nav className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-md px-1 py-2 text-sm text-ink/70 hover:text-ink">
          <ArrowLeft size={16} aria-hidden />
          처음으로
        </Link>
        <Link
          href={`/m/${meeting.code}/results`}
          className="focus-ring inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/90"
        >
          <BarChart3 size={16} aria-hidden />
          최적의 모임 날짜 보기
        </Link>
      </nav>

      <section className="mt-8">
        <p className="text-sm font-semibold text-leaf">참여 코드 {meeting.code}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink">{meeting.title}</h1>
        <p className="mt-3 text-sm text-ink/65">
          {formatKoreanDate(meeting.start_date)}부터 {formatKoreanDate(meeting.end_date)}까지 가능한 날짜를 선택하세요.
        </p>
      </section>

      <AvailabilityCalendar meeting={meeting} />
    </main>
  );
}
