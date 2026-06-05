import { NextResponse } from "next/server";
import { getMeetingByCode } from "@/lib/meetings";

type RouteContext = {
  params: Promise<{ code: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { code } = await context.params;
  const meeting = await getMeetingByCode(code);

  if (!meeting) {
    return NextResponse.json({ error: "모임을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({
    code: meeting.code,
    title: meeting.title,
    expectedCount: meeting.expected_count,
    startDate: meeting.start_date,
    endDate: meeting.end_date
  });
}
