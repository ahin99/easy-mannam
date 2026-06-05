import { NextResponse } from "next/server";
import { getMeetingResults } from "@/lib/results";

type RouteContext = {
  params: Promise<{ code: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { code } = await context.params;
    const results = await getMeetingResults(code);

    if (!results) {
      return NextResponse.json({ error: "모임을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "결과를 조회하지 못했습니다." }, { status: 500 });
  }
}
