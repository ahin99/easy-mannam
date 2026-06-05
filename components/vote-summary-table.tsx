import type { ResultDateRow } from "@/lib/types";

type Props = {
  rows: ResultDateRow[];
};

export function VoteSummaryTable({ rows }: Props) {
  return (
    <section className="mt-8 pb-12">
      <h2 className="mb-4 text-xl font-bold text-ink">날짜별 상세</h2>
      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <thead className="bg-paper text-ink/60">
              <tr>
                <th className="px-4 py-3 font-semibold">날짜</th>
                <th className="px-4 py-3 font-semibold">가능 인원</th>
                <th className="px-4 py-3 font-semibold">가능한 사람</th>
                <th className="px-4 py-3 font-semibold">불가능한 사람</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.date} className="border-t border-line">
                  <td className="px-4 py-3 font-semibold text-ink">{row.label}</td>
                  <td className="px-4 py-3 text-ink/75">{row.availableCount}명</td>
                  <td className="px-4 py-3 text-ink/75">{row.availableNames.length > 0 ? row.availableNames.join(", ") : "-"}</td>
                  <td className="px-4 py-3 text-ink/75">{row.unavailableNames.length > 0 ? row.unavailableNames.join(", ") : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
