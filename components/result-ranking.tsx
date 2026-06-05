import { Trophy } from "lucide-react";
import type { ResultDateRow } from "@/lib/types";

type Props = {
  topDates: ResultDateRow[];
};

export function ResultRanking({ topDates }: Props) {
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <Trophy size={20} className="text-leaf" aria-hidden />
        <h2 className="text-xl font-bold text-ink">최적의 모임 날짜</h2>
      </div>

      {topDates.length === 0 ? (
        <div className="rounded-lg border border-line bg-white p-5 text-sm text-ink/65">
          아직 제출된 투표가 없습니다.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          {topDates.map((row, index) => (
            <article key={row.date} className="rounded-lg border border-line bg-white p-5 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">{index + 1}순위</span>
                {row.isAllAvailable ? (
                  <span className="rounded-full bg-moss px-3 py-1 text-xs font-bold text-leaf">모두 가능</span>
                ) : null}
              </div>
              <h3 className="mt-4 text-xl font-bold text-ink">{row.label}</h3>
              <p className="mt-2 text-sm text-ink/65">
                가능 {row.availableCount}명
              </p>
              <p className="mt-4 text-sm leading-6 text-ink/70">
                불가능: {row.unavailableNames.length > 0 ? row.unavailableNames.join(", ") : "없음"}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
