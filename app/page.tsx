import Link from "next/link";
import { CalendarDays, LogIn, Plus } from "lucide-react";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-8">
      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-white">
          <CalendarDays size={22} aria-hidden />
        </div>
        <span className="text-lg font-bold tracking-tight">모일날</span>
      </header>

      <section className="flex flex-1 flex-col justify-center py-14">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold text-leaf">친구 모임 날짜 투표</p>
          <h1 className="text-4xl font-bold leading-tight tracking-normal text-ink sm:text-5xl">
            가능한 날짜를 모아 한눈에 최적의 모임 날짜를 찾으세요.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-ink/70">
            모임을 만들고 링크를 공유하면 친구들이 캘린더에서 가능한 날짜를 선택합니다.
            결과 화면에서 모두 가능한 날과 가장 많은 사람이 가능한 날을 바로 확인할 수 있습니다.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <Link
            href="/create"
            className="focus-ring flex min-h-36 items-center justify-between rounded-lg border border-ink bg-ink p-6 text-white shadow-soft transition hover:-translate-y-0.5"
          >
            <span>
              <span className="block text-xl font-bold">모임 생성</span>
              <span className="mt-2 block text-sm text-white/75">
                모임명, 인원, 날짜 기간을 정합니다.
              </span>
            </span>
            <Plus size={32} aria-hidden />
          </Link>

          <Link
            href="/join"
            className="focus-ring flex min-h-36 items-center justify-between rounded-lg border border-line bg-white p-6 text-ink shadow-soft transition hover:-translate-y-0.5"
          >
            <span>
              <span className="block text-xl font-bold">모임 참가</span>
              <span className="mt-2 block text-sm text-ink/65">
                참여 코드를 입력하고 가능한 날짜를 선택합니다.
              </span>
            </span>
            <LogIn size={32} aria-hidden />
          </Link>
        </div>
      </section>
    </main>
  );
}
