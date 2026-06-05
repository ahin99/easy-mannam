"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Copy, ExternalLink, Loader2 } from "lucide-react";

type CreatedMeeting = {
  code: string;
  joinUrl: string;
};

export function MeetingCreateForm() {
  const [title, setTitle] = useState("");
  const [expectedCount, setExpectedCount] = useState("4");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [created, setCreated] = useState<CreatedMeeting | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(() => {
    return title.trim().length > 0 && Number(expectedCount) > 0 && startDate.length > 0 && endDate.length > 0 && startDate <= endDate;
  }, [endDate, expectedCount, startDate, title]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    const response = await fetch("/api/meetings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title.trim(),
        expectedCount: Number(expectedCount),
        startDate,
        endDate
      })
    });

    const body = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(body.error ?? "모임을 생성하지 못했습니다.");
      return;
    }

    setCreated(body);
  }

  async function copyJoinUrl() {
    if (!created) {
      return;
    }
    await navigator.clipboard.writeText(created.joinUrl);
  }

  return (
    <div className="mt-8 rounded-lg border border-line bg-white p-5 shadow-soft">
      <form onSubmit={handleSubmit} className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-ink">모임명</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="예: 6월 친구 모임"
            className="focus-ring rounded-md border border-line px-3 py-3 text-base"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-ink">모임 인원</span>
          <input
            value={expectedCount}
            onChange={(event) => setExpectedCount(event.target.value)}
            min={1}
            max={100}
            type="number"
            className="focus-ring rounded-md border border-line px-3 py-3 text-base"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-ink">시작일</span>
            <input
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              type="date"
              className="focus-ring rounded-md border border-line px-3 py-3 text-base"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-ink">종료일</span>
            <input
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              type="date"
              className="focus-ring rounded-md border border-line px-3 py-3 text-base"
            />
          </label>
        </div>

        {error ? <p className="rounded-md bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p> : null}

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-ink/35"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={16} aria-hidden /> : null}
          모임 생성
        </button>
      </form>

      {created ? (
        <section className="mt-6 rounded-lg border border-leaf/30 bg-moss p-4">
          <p className="text-sm font-semibold text-leaf">모임이 생성되었습니다.</p>
          <p className="mt-3 text-sm text-ink/70">참여 코드</p>
          <p className="mt-1 text-2xl font-bold tracking-widest text-ink">{created.code}</p>
          <p className="mt-4 break-all rounded-md bg-white px-3 py-3 text-sm text-ink/75">{created.joinUrl}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyJoinUrl}
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink"
            >
              <Copy size={16} aria-hidden />
              링크 복사
            </button>
            <Link
              href={`/m/${created.code}`}
              className="focus-ring inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white"
            >
              <ExternalLink size={16} aria-hidden />
              투표 화면 열기
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
