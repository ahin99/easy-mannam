import { NextResponse } from "next/server";
import { isDateWithinRange } from "@/lib/date";
import { getMeetingByCode } from "@/lib/meetings";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { submitVoteSchema } from "@/lib/validations/vote";

type RouteContext = {
  params: Promise<{ code: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { code } = await context.params;
    const meeting = await getMeetingByCode(code);

    if (!meeting) {
      return NextResponse.json({ error: "모임을 찾을 수 없습니다." }, { status: 404 });
    }

    const body = await request.json();
    const parsed = submitVoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "입력값을 확인하세요." }, { status: 400 });
    }

    const uniqueDates = Array.from(new Set(parsed.data.availableDates)).sort();
    const invalidDate = uniqueDates.find((date) => !isDateWithinRange(date, meeting.start_date, meeting.end_date));

    if (invalidDate) {
      return NextResponse.json({ error: "모임 가능 기간 안의 날짜만 선택할 수 있습니다." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: participant, error: participantError } = await supabase
      .from("participants")
      .upsert(
        {
          meeting_id: meeting.id,
          name: parsed.data.name
        },
        {
          onConflict: "meeting_id,name"
        }
      )
      .select("id")
      .single();

    if (participantError || !participant) {
      throw participantError;
    }

    const { error: deleteError } = await supabase
      .from("availabilities")
      .delete()
      .eq("participant_id", participant.id);

    if (deleteError) {
      throw deleteError;
    }

    const rows = uniqueDates.map((date) => ({
      participant_id: participant.id,
      available_date: date
    }));

    if (rows.length > 0) {
      const { error: insertError } = await supabase.from("availabilities").insert(rows);

      if (insertError) {
        throw insertError;
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "투표를 저장하지 못했습니다." }, { status: 500 });
  }
}
