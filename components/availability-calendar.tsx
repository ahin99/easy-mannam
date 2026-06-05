"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { addMonths, eachDayOfInterval, endOfMonth, format, getDay, parseISO, startOfMonth } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarDays, Check, Edit3, Eye, Loader2 } from "lucide-react";
import type { Meeting } from "@/lib/types";
import { enumerateDateStrings, formatKoreanDate } from "@/lib/date";

type Props = {
  meeting: Meeting;
};

type SavedParticipant = {
  name: string;
  submittedDates: string[];
};

type CalendarMonth = {
  key: string;
  label: string;
  cells: Array<string | null>;
};

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

function buildCalendarMonths(startDate: string, endDate: string): CalendarMonth[] {
  const endMonth = startOfMonth(parseISO(endDate));
  let cursor = startOfMonth(parseISO(startDate));
  const months: CalendarMonth[] = [];

  while (cursor <= endMonth) {
    const monthStart = startOfMonth(cursor);
    const monthEnd = endOfMonth(cursor);
    const dateCells = eachDayOfInterval({ start: monthStart, end: monthEnd }).map((date) => format(date, "yyyy-MM-dd"));
    const leadingCells = Array.from<string | null>({ length: getDay(monthStart) }).fill(null);
    const rawCells = [...leadingCells, ...dateCells];
    const trailingCells = Array.from<string | null>({ length: (7 - (rawCells.length % 7)) % 7 }).fill(null);

    months.push({
      key: format(cursor, "yyyy-MM"),
      label: format(cursor, "yyyy년 M월", { locale: ko }),
      cells: [...rawCells, ...trailingCells]
    });

    cursor = addMonths(cursor, 1);
  }

  return months;
}

export function AvailabilityCalendar({ meeting }: Props) {
  const storageKey = `meeting:${meeting.code}:participant`;
  const legacyNameKey = `meeting:${meeting.code}:participantName`;
  const [nameInput, setNameInput] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [mode, setMode] = useState<"vote" | "summary">("vote");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const dates = useMemo(() => enumerateDateStrings(meeting.start_date, meeting.end_date), [meeting.end_date, meeting.start_date]);
  const selectableDates = useMemo(() => new Set(dates), [dates]);
  const calendarMonths = useMemo(() => buildCalendarMonths(meeting.start_date, meeting.end_date), [meeting.end_date, meeting.start_date]);
  const selectedDateList = useMemo(() => Array.from(selectedDates).sort(), [selectedDates]);
  const canSubmit = participantName.length > 0 && selectedDates.size > 0 && !isSubmitting;

  useEffect(() => {
    const savedParticipant = window.localStorage.getItem(storageKey);
    if (savedParticipant) {
      try {
        const parsed = JSON.parse(savedParticipant) as SavedParticipant;
        if (parsed.name) {
          setParticipantName(parsed.name);
          setNameInput(parsed.name);
          setSelectedDates(new Set(parsed.submittedDates ?? []));
          setHasSubmitted((parsed.submittedDates ?? []).length > 0);
          setMode((parsed.submittedDates ?? []).length > 0 ? "summary" : "vote");
          return;
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    const legacyName = window.localStorage.getItem(legacyNameKey);
    if (legacyName) {
      setParticipantName(legacyName);
      setNameInput(legacyName);
      window.localStorage.setItem(storageKey, JSON.stringify({ name: legacyName, submittedDates: [] }));
    }
  }, [legacyNameKey, storageKey]);

  function handleNameSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = nameInput.trim();
    if (!nextName) {
      return;
    }

    setParticipantName(nextName);
    window.localStorage.setItem(storageKey, JSON.stringify({ name: nextName, submittedDates: [] }));
  }

  function toggleDate(date: string) {
    if (!selectableDates.has(date)) {
      return;
    }

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

    const response = await fetch(`/api/meetings/${meeting.code}/votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: participantName,
        availableDates: selectedDateList
      })
    });

    const body = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(body.error ?? "투표를 제출하지 못했습니다.");
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify({ name: participantName, submittedDates: selectedDateList }));
    window.localStorage.setItem(legacyNameKey, participantName);
    setHasSubmitted(true);
    setMode("summary");
    setMessage("투표가 제출되었습니다.");
  }

  if (!participantName) {
    return (
      <section className="mt-8 grid gap-6 lg:grid-cols-[18rem_1fr]">
        <aside className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
            <CalendarDays size={22} aria-hidden />
          </div>
          <h2 className="mt-5 text-xl font-bold text-ink">이름 입력</h2>
          <p className="mt-2 text-sm leading-6 text-ink/65">
            이 모임에서 사용할 이름입니다. 한 번 입력하면 이 브라우저에서는 같은 이름으로 투표를 수정합니다.
          </p>
        </aside>

        <form onSubmit={handleNameSubmit} className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-ink">내 이름</span>
            <input
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="이름 입력"
              maxLength={30}
              className="focus-ring rounded-md border border-line px-3 py-3 text-base"
            />
          </label>

          <button
            type="submit"
            disabled={nameInput.trim().length === 0}
            className="focus-ring mt-5 inline-flex w-full items-center justify-center rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-ink/35"
          >
            날짜 선택하러 가기
          </button>
        </form>
      </section>
    );
  }

  if (hasSubmitted && mode === "summary") {
    return (
      <section className="mt-8 grid gap-6 lg:grid-cols-[18rem_1fr]">
        <aside className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <p className="text-sm text-ink/60">내 이름</p>
          <p className="mt-1 text-xl font-bold text-ink">{participantName}</p>
          <p className="mt-5 rounded-lg bg-paper p-4 text-sm leading-6 text-ink/70">
            이 브라우저에서는 이름을 바꿔 새 사용자로 투표할 수 없습니다.
          </p>

          <Link
            href={`/m/${meeting.code}/results`}
            className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white"
          >
            <Eye size={16} aria-hidden />
            최적의 모임 날짜 보기
          </Link>
          <button
            type="button"
            onClick={() => setMode("summary")}
            className="focus-ring mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-3 text-sm font-semibold text-ink"
          >
            <CalendarDays size={16} aria-hidden />
            내 투표 날짜 보기
          </button>
          <button
            type="button"
            onClick={() => {
              setMessage("");
              setError("");
              setMode("vote");
            }}
            className="focus-ring mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-3 text-sm font-semibold text-ink"
          >
            <Edit3 size={16} aria-hidden />
            내 날짜 수정하기
          </button>
        </aside>

        <article className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold text-ink">내 투표 날짜</h2>
          {message ? <p className="mt-4 rounded-md bg-leaf/10 px-3 py-2 text-sm text-leaf">{message}</p> : null}
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {selectedDateList.map((date) => (
              <div key={date} className="rounded-lg border border-line bg-paper px-4 py-3 text-sm font-semibold text-ink">
                {formatKoreanDate(date)}
              </div>
            ))}
          </div>
        </article>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-[18rem_1fr]">
      <aside className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <p className="text-sm text-ink/60">내 이름</p>
        <p className="mt-1 text-xl font-bold text-ink">{participantName}</p>

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
          {hasSubmitted ? "수정 완료" : "제출하기"}
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

        <div className="grid gap-5 xl:grid-cols-2">
          {calendarMonths.map((month) => (
            <div key={month.key} className="rounded-lg border border-line bg-paper p-3">
              <h3 className="px-1 pb-3 text-base font-bold text-ink">{month.label}</h3>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink/55">
                {weekdays.map((weekday) => (
                  <div key={weekday} className="py-1">
                    {weekday}
                  </div>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {month.cells.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${month.key}-${index}`} className="aspect-square rounded-md" />;
                  }

                  const selected = selectedDates.has(date);
                  const selectable = selectableDates.has(date);
                  const day = format(parseISO(date), "d");

                  return (
                    <button
                      key={date}
                      type="button"
                      disabled={!selectable}
                      onClick={() => toggleDate(date)}
                      className={`focus-ring aspect-square rounded-md border text-sm font-semibold transition ${
                        selected
                          ? "border-leaf bg-leaf text-white"
                          : selectable
                            ? "border-line bg-white text-ink hover:border-leaf/50 hover:bg-moss"
                            : "cursor-not-allowed border-transparent bg-transparent text-ink/20"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </form>
  );
}
