import { enumerateDateStrings, formatKoreanDate } from "@/lib/date";
import { getMeetingByCode } from "@/lib/meetings";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { Availability, MeetingResults, Participant, ResultDateRow } from "@/lib/types";

export async function getMeetingResults(code: string): Promise<MeetingResults | null> {
  const meeting = await getMeetingByCode(code);

  if (!meeting) {
    return null;
  }

  const supabase = getSupabaseAdmin();
  const { data: participants, error: participantsError } = await supabase
    .from("participants")
    .select("id, meeting_id, name")
    .eq("meeting_id", meeting.id)
    .order("created_at", { ascending: true })
    .returns<Participant[]>();

  if (participantsError) {
    throw participantsError;
  }

  const participantIds = participants.map((participant) => participant.id);
  let availabilities: Availability[] = [];

  if (participantIds.length > 0) {
    const { data, error } = await supabase
      .from("availabilities")
      .select("participant_id, available_date")
      .in("participant_id", participantIds)
      .returns<Availability[]>();

    if (error) {
      throw error;
    }

    availabilities = data;
  }

  const availableByParticipant = new Map<string, Set<string>>();
  for (const participant of participants) {
    availableByParticipant.set(participant.id, new Set());
  }

  for (const availability of availabilities) {
    availableByParticipant.get(availability.participant_id)?.add(availability.available_date);
  }

  const votedCount = participants.length;
  const rows: ResultDateRow[] = enumerateDateStrings(meeting.start_date, meeting.end_date).map((date) => {
    const availableNames = participants
      .filter((participant) => availableByParticipant.get(participant.id)?.has(date))
      .map((participant) => participant.name);
    const unavailableNames = participants
      .filter((participant) => !availableByParticipant.get(participant.id)?.has(date))
      .map((participant) => participant.name);

    return {
      date,
      label: formatKoreanDate(date),
      availableCount: availableNames.length,
      availableNames,
      unavailableNames,
      isAllAvailable: votedCount > 0 && availableNames.length === votedCount
    };
  });

  const sortedRows = [...rows].sort((a, b) => {
    if (b.availableCount !== a.availableCount) {
      return b.availableCount - a.availableCount;
    }
    return a.date.localeCompare(b.date);
  });

  return {
    code: meeting.code,
    title: meeting.title,
    expectedCount: meeting.expected_count,
    votedCount,
    notVotedCount: Math.max(meeting.expected_count - votedCount, 0),
    topDates: sortedRows.slice(0, 3),
    dateRows: sortedRows
  };
}
