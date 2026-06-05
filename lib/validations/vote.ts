import { z } from "zod";

export const submitVoteSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력하세요.").max(30, "이름은 30자 이하로 입력하세요."),
  availableDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).min(1, "가능한 날짜를 하나 이상 선택하세요.")
});
