import { NextResponse } from "next/server";
import { createMeetingSchema } from "@/lib/validations/meeting";
import { getSupabaseAdmin } from "@/lib/supabase/server";

function createCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const randomValues = crypto.getRandomValues(new Uint32Array(6));
  return Array.from(randomValues, (value) => alphabet[value % alphabet.length]).join("");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createMeetingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "입력값을 확인하세요." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    let createdCode = "";
    let inserted = null;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = createCode();
      const { data, error } = await supabase
        .from("meetings")
        .insert({
          code,
          title: parsed.data.title,
          expected_count: parsed.data.expectedCount,
          start_date: parsed.data.startDate,
          end_date: parsed.data.endDate
        })
        .select("code")
        .single();

      if (!error && data) {
        createdCode = data.code;
        inserted = data;
        break;
      }

      if (error?.code !== "23505") {
        throw error;
      }
    }

    if (!inserted) {
      return NextResponse.json({ error: "참여 코드 생성에 실패했습니다." }, { status: 500 });
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

    return NextResponse.json({
      code: createdCode,
      joinUrl: `${origin.replace(/\/$/, "")}/m/${createdCode}`
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "서버 설정 또는 데이터베이스 연결을 확인하세요." }, { status: 500 });
  }
}
