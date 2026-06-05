import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { Meeting } from "@/lib/types";

export async function getMeetingByCode(code: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .eq("code", code.toUpperCase())
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Meeting;
}
