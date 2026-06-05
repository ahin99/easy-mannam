"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import type { Meeting } from "@/lib/types";
import { enumerateDateStrings, formatKoreanDate, getShortWeekday } from "@/lib/date";

type Props = {
  meeting: Meeting;
};

export function AvailabilityCalendar({ meeting }: Props) {
  const storageKey = `meeting:${meeting.code}:participantName`;
  const [name, setName] = useState("");
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const dates = useMemo(() => enumerateDateStrings(meeting.start_date, meeting.end_date), [meeting.end_date, meeting.start_date]);
  const canSubmit = name.trim().length > 0 && selectedDates.size > 0 && !isSubmitting;

  useEffect(() => {
    const savedName = window.localStorage.getItem(storageKey);
    if (savedName) {
      setName(savedName);
    }
  }, [storageKey]);

  function toggleDate(date: string) {
    setSelectedDates((current) => {
      const next = new Set(current);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    const normalizedName = name.trim();
    const response = await fetch(`/api/meetings/${meeting.code}/votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: normalizedName,
        availableDates: Array.from(selectedDates).sort()
      })
    });

    const body = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(body.error ?? "투표를 제출하지 못했습니다.");
      return;
    }

    window.localStorage.setItem(storageKey, normalizedName);
    setMessage("투표가 제출되었습니다. 같은 이름으로 다시 제출하면 기존 선택이 수정됩니다.");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-[18rem_1fr]">
      <aside className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-ink">내 이름</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="이름 입력"
            className="focus-ring rounded-md border border-line px-3 py-3 text-base"
          />
        </label>

        <div className="mt-5 rounded-lg bg-paper p-4 text-sm leading-6 text-ink/70">
          <p className="font-semibold text-ink">선택한 날짜</p>
          <p className="mt-1">{selectedDates.size}개</p>
        </div>

        {error ? <p className="mt-4 rounded-md bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p> : null}
        {message ? <p className="mt-4 rounded-md bg-leaf/10 px-3 py-2 text-sm text-leaf">{message}</p> : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-ink/35"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={16} aria-hidden /> : <Check size={16} aria-hidden />}
          제출하기
        </button>

        <Link
          href={`/m/${meeting.code}/results`}
          className="focus-ring mt-3 inline-flex w-full items-center justify-center rounded-md border border-line bg-white px-4 py-3 text-sm font-semibold text-ink"
        >
          최적의 모임 날짜 보기
        </Link>
      </aside>

      <section className="rounded-lg border border-line bg-white p-4 shadow-soft">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-ink">가능한 날짜 선택</h2>
          <p className="text-sm text-ink/60">
            {formatKoreanDate(meeting.start_date)} - {formatKoreanDate(meeting.end_date)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {dates.map((date) => {
            const selected = selectedDates.has(date);
            return (
              <button
                key={date}
                type="button"
                onClick={() => toggleDate(date)}
                className={`focus-ring min-h-24 rounded-lg border p-3 text-left transition ${
                  selected
                    ? "border-leaf bg-moss text-ink"
                    : "border-line bg-white text-ink hover:border-leaf/45"
                }`}
              >
                <span className="block text-xs font-semibold text-ink/55">{getShortWeekday(date)}</span>
                <span className="mt-2 block text-lg font-bold">{formatKoreanDate(date).replace(/요일$/, "")}</span>
                <span className={`mt-3 inline-flex h-6 min-w-6 items-center justify-center rounded-full text-xs font-bold ${selected ? "bg-leaf text-white" : "bg-paper text-ink/35"}`}>
                  {selected ? "선택" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </form>
  );
}
